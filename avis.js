export function ajoutListenersAvis() {
  const piecesElements = document.querySelectorAll(".fiches button");

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async function (event) {
      const id = event.target.dataset.id;
      console.log(id);
      let avisPromise = await fetch(`http://localhost:5500/pieces/${id}/avis`);
      let avis = await avisPromise.json();
      console.log(avis);
    });
  }
}