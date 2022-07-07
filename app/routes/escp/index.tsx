import NavBar from "../../navbar";

const imageSrc = "https://i.imgur.com/VsjXh0s.jpg";

export default function escp() {
  return (
    <div className="flex w-full justify-center">
      <main className="flex w-3/5 flex-col items-center font-mono">
        <div className="flex w-full flex-col font-light">
          <NavBar active="escp" />
          <h1 className="my-4 font-bold">escp.90</h1>

          <div className="flex flex-col">
            <img className="w-full" src={imageSrc} alt="Hall" />
            <p className="my-4">90 sq m for rent.</p>
            <p className="my-4">фото студія, бул. Вацлава Гавела 4.</p>
            <p className="my-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
              ratione error deserunt veritatis officiis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
