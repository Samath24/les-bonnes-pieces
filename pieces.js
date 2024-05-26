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

const nomPieces = pieces.map( piece => piece.nom );

/* Test de performance sur .forEach() */
/* const perfStartForEach = performance.now(); */
const prixPiecesDoubleForEach = Array.from(pieces, piece => ({
  ...piece,
  prix: piece.prix*2
}));
/* const perfEndForEach = performance.now(); */

/* Test de performance sur .map() */
/* const perfStartMap = performance.now(); */
const prixPiecesDoubleMap = pieces.map(pieces => {
  return pieces.prix * 2;
});
console.log(prixPiecesDoubleMap);
/* const perfEndMap = performance.now(); */

/* Conclusion :
.forEach() execution time: 0.09999999962747097 ms
.map() execution time: 0.19999999925494194 ms
Cloner un tableau puis le modifier via .forEach() est plus intéressant, et de très loin, qu'utiliser .map() et de récupérer le tableau renvoyé
*/