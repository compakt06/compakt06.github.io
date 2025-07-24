import './characters-style.css';

export default function Navbar() {
  return (
    <div className="nav-bar">
        <h1>Welcome to awesome characters wiki!</h1>
        <ul>
            <li><a href="/">Main page</a></li>
            <li><a href="/characters.html">Characters</a></li>
        </ul>
    </div>
  );
}