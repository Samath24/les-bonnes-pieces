export function ajoutListenersAvis() {
  const piecesElements = document.querySelectorAll(".fiches button");

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async function (event) {
      const id = event.target.dataset.id;
      console.log(id);
      /* fetch(`http://localhost:8081/pieces/${id}/avis`); */
    });
  }
}