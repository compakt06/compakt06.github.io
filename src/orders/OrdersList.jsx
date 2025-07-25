import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing Firestore listener...");
    
    // Basic query without sorting first to test if we get all documents
    const q = query(collection(db, "order"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`Received ${querySnapshot.size} documents`);
      
      const allOrders = [];
      querySnapshot.forEach((doc) => {
        console.log(`Processing document ${doc.id}`, doc.data());
        
        const data = doc.data();
        allOrders.push({
          id: doc.id,
          table: data.table || 'Nieznany',
          staffID: data.staffID || 'Nieznany',
          status: data.status || 'Oczekujące',
          createdAt: data.created_at || data.createdAt, // Handle both cases
          items: normalizeItems(data.items)
        });
      });

      console.log("All orders:", allOrders);
      setOrders(allOrders);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to ensure items are always an array
  const normalizeItems = (items) => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (items.name) return [items]; // Single item case
    return [];
  };

  const formatStatus = (status) => {
    if (!status) return "Oczekujące";
    return status.replace('_', ' ').replace('.', ' ');
  };

  if (loading) {
    return <div className="p-4">Ładowanie zamówień...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">📦 Zamówienia ({orders.length})</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">Brak zamówień</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <p><strong>🪑 Stolik:</strong> {order.table}</p>
                <p><strong>👨‍🍳 Kelner:</strong> {order.staffID}</p>
                <p>
                  <strong>📅 Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    order.status.includes('complete') 
                      ? 'bg-green-100 text-green-800' 
                      : order.status.includes('progress')
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formatStatus(order.status)}
                  </span>
                </p>
              </div>
              
              <div className="mt-4">
                <p className="font-semibold mb-2">🍔 Produkty:</p>
                <ul className="space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name || 'Nieznana pozycja'}</span>
                      <span className="font-medium">× {item.quantity || 1}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {order.createdAt && (
                <p className="text-sm text-gray-500 mt-3">
                  🕒 {order.createdAt.toDate().toLocaleString('pl-PL')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}