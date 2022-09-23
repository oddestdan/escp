import NavBar from "~/components/NavBar/NavBar";
import Footer from "~/components/Footer/Footer";

export default function rules() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="rules" />

      <div className="flex w-full flex-1 flex-col font-light">
        <h1 className="mx-auto mt-16 flex w-full justify-between font-medium text-stone-900 sm:w-3/5">
          Правила
        </h1>
        <div className="my-4 mx-auto flex flex-col sm:w-3/5">
          <p className="mt-4">
            <span className="bg-white">
              Бронювання здійснюється після повної оплати. Оплата за бронювання
              студії не повертається.
            </span>
          </p>
          <p className="mt-4">
            <span className="bg-white">
              Перенести бронювання можливо не менш ніж за 48 годин до зйомки. В
              інших випадках оплата згорає.
            </span>
          </p>
          <p className="mt-4">
            <span className="bg-white">
              Фактичний час оренди при бронюванні однієї години -- 55 хвилин.
            </span>
          </p>
          <p className="mt-4">
            <span className="bg-white">
              У залі можна знаходитись тільки в змінному взутті або в наших
              капцях.
            </span>
          </p>
          <p className="mt-4">
            <span className="bg-white">
              Здавати зал адміністратору потрібно в чистому вигляді та з усіма
              предметами на своїх місцях. Інші нюанси (використання блискіток,
              землі і т.п.) потрібно обов'язково узгоджувати з адміністратором
              та закладати додатковий час для прибирання.
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
