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

/* Copie du tableau "pieces", multiplication par 2 des prix dans la copie créée, sans affecter le tableau original => nécessité d'une "deep copy" permise par la fonction structuredClone() */
const testDouble = structuredClone(pieces);
testDouble.forEach( (piece) => {
  piece.prix = piece.prix*2
})
console.log('pieces = ', pieces);
console.log('testDouble = ', testDouble);