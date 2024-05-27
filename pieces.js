// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

for (let i = 0; i < pieces.length; i++) {
  const article = document.querySelector(".fiches");
  article.innerHTML += `
  <div class="piece-${pieces[i].id}">
    <img src=${pieces[i].image} />
    <h2>${pieces[i].nom}</h2>
    <p>
      Prix: ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})
    </p>
    <p>
      ${pieces[i].categorie ?? "Aucune catégorie"}
    </p>
    <p>
      ${pieces[i].description ?? "Pas de description pour le moment"}
    </p>
    <p class="${pieces[i].disponibilite ? "en-stock" : "rupture"}">
      ${pieces[i].disponibilite ? "En stock" : "Rupture de stock"}
    </p>
  </div>
  `;
}

/* Bouton de tri par prix croissant */
const btnTrier = document.querySelector(".btn-trier");
btnTrier.addEventListener("click", () => {
  const piecesTriees = Array.from(pieces);
  piecesTriees.sort( (a,b) => a.prix - b.prix );
  console.log(piecesTriees); 
});

/* Bouton de tri par prix décroissant */
const btnTrierDecroissant = document.querySelector(".btn-trier-decroissant");
btnTrierDecroissant.addEventListener("click", () => {
  const piecesTriees = Array.from(pieces);
  piecesTriees.sort( (a,b) => b.prix - a.prix );
  console.log(piecesTriees); 
});

/* Bouton de filtre dont le prix est <= 35 */
const btnFiltrer = document.querySelector(".btn-filtrer");
btnFiltrer.addEventListener("click", () => {
  const piecesPrepFiltrage = Array.from(pieces);
  let piecesFiltrees = piecesPrepFiltrage.filter( (piece) => piece.prix <= 35 );
  console.log(piecesFiltrees); 
});

/* Bouton de filtre excluant les éléments sans description */
const btnFiltrerDescription = document.querySelector(".btn-filtrer-description");
btnFiltrerDescription.addEventListener("click", () => {
  const piecesPrepFiltrage = Array.from(pieces);
  let piecesFiltrees = piecesPrepFiltrage.filter( (piece) => piece.description );
  console.log(piecesFiltrees); 
});

/* Méthode pour créer un objet ne conservant que les valeurs souhaitées ( ici, le nom des pièces ) */
const nomPieces = pieces.map( piece => piece.nom );

/* Suppression des éléments dont prix >= à 35. Tableau parcouru de la fin vers le début dans le cadre d'une suppression, pour éviter les décalages d'indices, faisant potentiellement échouer le test sur certains indices */
for (let i = pieces.length-1; i >= 0; i--) {
  if ( pieces[i].prix >= 35) {
    nomPieces.splice(i, 1);
  }
}

/* Ce qui revient au même qu'un filtrage, qui a l'avantage d'être plus facile à lire */
const prepPiecesFiltreesPrix = structuredClone(pieces);
const piecesFiltreesPrix = prepPiecesFiltreesPrix.filter( (piece) => !(piece.prix >= 35) );

/* Copie du tableau "pieces", multiplication par 2 des prix dans la copie créée, sans affecter le tableau original => nécessité d'une "deep copy" permise par la fonction structuredClone() */
const testDouble = structuredClone(pieces);
testDouble.forEach( (piece) => {
  piece.prix = piece.prix*2;
})

/* Premier jet d'insertion du résultat d'un filtre de prix dans le HTML au noeud ".fiches". Utilisation d'une fonction pour pouvoir être appelée depuis le template literal ( littéral de gabarit ), faisant éviter la syntaxe lourde et illisible basée sur createElement / appendChild */
/* 
  @param {array} array - contenant les données à parcourir
  @param {string} value - indiquant la valeur à afficher
*/
const afficherResultatFiltresAbordables = () => {
  try {
    let affichageComplet = ``;
    for (let i = 0; i < piecesFiltreesPrix.length; i++) {
      affichageComplet += 
      `
        <li>${piecesFiltreesPrix[i].nom}</li>
      `;
    }
    return affichageComplet;
  } catch (error) {
    return console.log(error);
  }
}

let fichesNode = document.querySelector(".fiches");
fichesNode.innerHTML += 
  `
  <div>
    <h3>Pièces abordables :</h3>
    <ul>
      ${afficherResultatFiltresAbordables()}
    </ul>
  </div>
  `
;

/* Deuxième jet, cette fois en filtrant sur la description */
const prepPiecesFiltreesDesc = structuredClone(pieces);
const piecesFiltreesDesc = prepPiecesFiltreesDesc.filter( (piece) => (piece.description) );

const afficherResultatFiltresDisponibles = () => {
  try {
    let affichageComplet = ``;
    for (let i = 0; i < piecesFiltreesDesc.length; i++) {
      affichageComplet += 
      `
        <li>${piecesFiltreesDesc[i].nom} - ${piecesFiltreesDesc[i].prix} €</li>
      `;
    }
    return affichageComplet;
  } catch (error) {
    return console.log(error);
  }
}

fichesNode.innerHTML += 
  `
  <div>
    <h3>Pièces disponibles :</h3>
    <ul>
      ${afficherResultatFiltresDisponibles()}
    </ul>
  </div>
  `
;