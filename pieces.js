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

const testDouble = structuredClone(pieces);
testDouble.forEach( (piece) => {
  piece.prix = piece.prix*2
})
console.log('pieces = ', pieces);
console.log('testDouble = ', testDouble);

/* Deep copy du tableau originel "pieces" : modifier cette copie n'affectera pas les valeurs référencées. A noter la fonction de mappage comme 2nd argument de la méthode Array.from(), qui permet d'ignorer la shallow copy du spreading operator, qui écrase les références pendant le traitement */
/* const prixPiecesDoubleArrayFrom = Array.from(pieces, piece => ({
  ...piece,
  'prix': piece.prix*2
})); */

/* Deep copy du tableau originel "pieces" : modifier cette copie n'affectera pas les valeurs référencées */
/* const prixPiecesDoubleMap = pieces.map((piece) => {
  return piece.prix * 2;
}); */

/* Shallow copy du tableau originel "pieces" : modifier cette copie affectera les valeurs référencées. A l'incovénient de ne rien renvoyer */
/* const prixPiecesDoubleForEach = pieces.forEach(piece => {
  piece.prix * 2;
}); */

/* Shallow copy du tableau originel "pieces" : modifier cette copie affectera les valeurs référencées. Sauf si usage de .map(), comme ici */
/* const prixPiecesDoubleSpread = [...pieces].map(piece => {
  return piece.prix*2
}); */

/* console.log(pieces); */
/* console.log(prixPiecesDoubleArrayFrom); */
/* console.log(prixPiecesDoubleMap); */
/* console.log(prixPiecesDoubleForEach); */
/* console.log(prixPiecesDoubleSpread); */

/* Conclusion :
    Dans le cas présent, nous cherchons à créer une COPIE d'un tableau existant, puis de MODIFIER cette copie, sans affecter l'original.
    4 outils sont à notre disposition :
    - .forEach(), rapide à exécuter mais ne retourne aucune valeur. Son utilisation nécessite au préalable une opération de copie.
    - .map(), sensiblement plus lent que .forEach() : c'est son principal défaut. Permet cependant la copie profonde.
    - ..., le spread operator, qui copie mais déstructure l'array, que l'on reforme simplement en ajoutant les [] autour : [...array]. Il crée une copie de surface, et conserve donc    les références aux valeurs de la source.
    - Array.from(), crée une copie de surface d'un itérable : objets, arrays, listes... et même strings ! A le mérite d'accepter une fonction de mappage comme argument.

    Pesons les avantages et les inconvénients :
    - .forEach() ne renvoie rien, et nécessite une copie préalable
    - .map(), on l'a vu, est trop lent comparé aux alternatives.
    - ... crée une copie de surface, ce n'est pas suffisant dans notre cas
    - Array.from() crée également une copie de surface, mais peut être mappé via son second argument ( optionnel )

    Comment faire, vu qu'aucun outil seul ne fait l'affaire ? Idéalement, il faudrait une combinaison de ceux-ci... et c'est exactement la solution à notre problème !
    Prenons comme exemple le bout de code suivant :

    const prixPiecesDoubleArrayFrom = Array.from(pieces, piece => ({
      ...piece,
      prix: piece.prix*2
    }));

    L'on s'aperçoit que l'on utilise non pas 2, mais 3 techniques combinées ! Décortiquons :

    const prixPiecesDoubleArrayFrom = Array.from(pieces, piece => ({}))

    L'on crée une copie de surface de l'array "pieces", puis on utilise le 2nd argument comme fonction de mappage, permettant à la fois la copie profonde, les opérations nécessaires, sans passer par la lenteur relative de .map(), qui renvoie une valeur à CHAQUE itération...

    => ({
      ...piece,
      prix: piece.prix*2
    })

    La fonction fléchée de mappage à proprement parler, prenant là aussi 2 paramètres : le tableau source, puis l'opération à effectuer.
    Mais, attendez... on a DEJA copié un tableau via Array.from, pourquoi recommencer ? Très bonne question ! Tout est question de portée : le nouveau tableau copié via Array.from n'est _pas encore_ créé, vu que nous sommes en train de paramétrer son traitement... il faut donc appeler de nouveau le tableau *directeement*, sans passer par un stockage en variable externe. Le spread operator devient ici tout indiqué, d'autant plus qu'il fait partie de la fonction de mappage, et donc que la copie en surface n'est pas un problème ! L'on déstructure donc via le spread le tableau "pieces" ( 1er paramètre de l'Array.from() ). Chaque itération se fera sur une paire clé:valeur, appelée "piece" le temps du traitement, avant de recommencer jusqu'au parcours complet de "pieces". Voila pour le premier paramètre.  
    Le second est plus simple à comprendre :  chaque itération, on définit pour la propriété "prix" la valeur "piece.prix*2". Notez la notation objet, nécessaire pour accéder à la bonne valeur de l'itération en cours.

    Il ne reste plus qu'à fermer les } et les )) !

    Sinon... il existe "structuredClone", entièrement pris en charge par tous les navigateurs, mobiles, serveurs... :
    const testDouble = structuredClone(pieces);
    testDouble.forEach( (piece) => {
      piece.prix = piece.prix*2
    })
    console.log('pieces = ', pieces);
    console.log('testDouble = ', testDouble);
*/

/* Conclusion des tests de performance :
    .forEach() execution time: 0.09999999962747097 ms
    .map() execution time: 0.19999999925494194 ms
    Cloner un tableau puis le modifier via .forEach() est plus intéressant, et de très loin, qu'utiliser .map() et de récupérer le tableau renvoyé
*/