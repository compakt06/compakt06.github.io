import './characters-style.css';
import kiryuImage from './assets/images/Y0_-_Character_Profile_-_Kazuma_Kiryu.webp';
import majimaImage from './assets/images/Y0_-_Character_Profile_-_Goro_Majima.webp';
import nishikiImage from './assets/images/Y0_-_Character_Profile_-_Akira_Nishikiyama.webp';

export default function CharacterCards() {
  const characters = [
    {
      image: kiryuImage,
      name: "Kiryu Kazuma",
      description: "Very cool guy",
      link: "https://yakuza.fandom.com/wiki/Kazuma_Kiryu"
    },
    {
      image: majimaImage,
      name: "Goro Majima",
      description: "Cool guy",
      link: "https://yakuza.fandom.com/wiki/Goro_Majima"
    },
    {
      image: nishikiImage,
      name: "Akira Nishikiyama",
      description: "Not so cool (very evil)",
      link: "https://yakuza.fandom.com/wiki/Akira_Nishikiyama"
    }
  ];

  return (
    <div className="content">
      {characters.map((character, index) => (
        <div key={index} className="card">
          <img src={character.image} alt={character.name} />
          <h2>{character.name}</h2>
          <p>{character.description}</p>
          <button onClick={() => window.location.href = character.link}>
            More Info
          </button>
        </div>
      ))}
    </div>
  );
}