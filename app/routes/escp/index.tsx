import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";

const imageSrcFront = "https://i.imgur.com/2gUgtbh.jpg";
const imageSrcBack = "https://i.imgur.com/XcwX5jr.jpg";
const imageSrcRoute = "https://i.imgur.com/kb7520L.png";

export default function Escp() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 font-mono">
      <NavBar active="escp" />

      <div className="flex w-full flex-col font-light">
        <Header current="escp" />

        <div className="mx-auto flex flex-col sm:w-3/5">
          <img
            className="my-4 aspect-[3/2] w-full bg-stone-100"
            src={imageSrcFront}
            alt="Hall front"
          />
          <p className="my-4">
            90 sq m for rent.
            <br />
            фото студія, бул. Вацлава Гавела 4.
          </p>
          <img
            className="my-4 aspect-[3/2] w-full bg-stone-100"
            src={imageSrcBack}
            alt="Hall back"
          />
          <p className="my-4">
            прохідна з сірими воротами ліворуч від "Silver Centre"
            <br />
            <br />
            йдіть прямо вниз до останнього корпусу
            <br />
            перед нм ліворуч та з правого боку будуть вхідні двері
            <br />
            піднімайтесь на 4й поверх та знайдіть нас
          </p>
          <img
            className="my-4 aspect-[27/12] w-full bg-stone-100"
            src={imageSrcRoute}
            alt="Route"
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
