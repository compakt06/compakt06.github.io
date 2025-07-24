import './App.css';
import './style.css';
import Navbar from './Navbar';
import CharacterCards from './CharacterCards';
import animeGif from './assets/images/anime-aaaa.gif';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        {/* Read-only editor */}
        <label htmlFor="readonly-textarea">Read-only editor:</label><br />
        <textarea
          id="readonly-textarea"
          readOnly
          rows={4}
          cols={50}
          defaultValue="Haha try to edit me"
        ></textarea>

        <br /><br />

        {/* Locked checkbox */}
        <input type="checkbox" id="locked-checkbox" checked disabled />
        <label htmlFor="locked-checkbox">hah you cant undo me</label>

        {/* Main GIF image */}
        <img src={animeGif} alt="Cool animation" />

        <CharacterCards />
      </div>
    </>
  );
}