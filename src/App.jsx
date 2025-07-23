import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './style.css'; // your main CSS
import './characters-style.css'; // characters specific CSS

function App() {
  return (
    <>
      <div className="nav-bar">
        <h1>Welcome to awesome characters wiki!</h1>
        <ul>
          <li><a href="index.html">Main page</a></li>
          <li><a href="characters.html">Characters</a></li>
        </ul>
      </div>

      <div className="content">
        {/* Read-only editor + checkbox from first file */}
        <label htmlFor="readonly-textarea">Read-only editor:</label><br />
        <textarea
          id="readonly-textarea"
          readOnly
          rows={4}
          cols={50}
          defaultValue="Haha try to edit me"
        ></textarea>

        <br /><br />

        <input type="checkbox" id="locked-checkbox" checked disabled />
        <label htmlFor="locked-checkbox">hah you cant undo me</label>

        {/* Image from first file */}
        <img src="images/anime-aaaa.gif" alt="Cool animation" />

        {/* Cards from second file */}
        <div className="card">
          <img
            src="images/Y0_-_Character_Profile_-_Kazuma_Kiryu.webp"
            alt="Kiryu Kazuma"
          />
          <h2>Kiryu Kazuma</h2>
          <p>Very cool guy</p>
          <button onClick={() => window.location.href = 'https://yakuza.fandom.com/wiki/Kazuma_Kiryu'}>
            More Info
          </button>
        </div>

        <div className="card">
          <img
            src="images/Y0_-_Character_Profile_-_Goro_Majima.webp"
            alt="Goro Majima"
          />
          <h2>Goro Majima</h2>
          <p>Cool guy</p>
          <button onClick={() => window.location.href = 'https://yakuza.fandom.com/wiki/Goro_Majima'}>
            More Info
          </button>
        </div>

        <div className="card">
          <img
            src="images/Y0_-_Character_Profile_-_Akira_Nishikiyama.webp"
            alt="Akira Nishikiyama"
          />
          <h2>Akira Nishikiyama</h2>
          <p>Not so cool (very evil)</p>
          <button onClick={() => window.location.href = 'https://yakuza.fandom.com/wiki/Akira_Nishikiyama'}>
            More Info
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

