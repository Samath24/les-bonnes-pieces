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

const btnTrier = document.querySelector(".btn-trier");
btnTrier.addEventListener("click", () => {
  pieces.sort( (a,b) => a.prix - b.prix );
  console.log(pieces); 
});