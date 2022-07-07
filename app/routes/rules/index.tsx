import NavBar from "../../navbar";

export default function rules() {
  return (
    <div className="flex w-full justify-center">
      <main className="flex w-3/5 flex-col items-center font-mono">
        <NavBar active="rules" />
        <div className="flex w-full flex-col font-light">
          <h1 className="my-4 font-bold">правила</h1>
          <p className="my-4">
            бронювання здійснюється після повної оплати. оплата за бронювання
            студії не повертається.
          </p>
          <p className="my-4">
            перенести бронювання можливо не менш ніж за 48 годин до зйомки. в
            інших випадках оплата згорає.
          </p>
          <p className="my-4">
            фактичний час оренди при бронюванні однієї години -- 55 хвилин.
          </p>
          <p className="my-4">
            в залі можна знаходитись тільки в змінному взутті або в наших
            капцях.
          </p>
          <p className="my-4">
            здавати зал адміністратору потрібно в чистому вигляді та з усіма
            предметами на своїх місцях. інші нюанси (використання блискіток,
            землі і т.п.) потрібно обов'язково узгоджувати з адміністратором та
            закладати додатковий час для прибирання.
          </p>
        </div>
      </main>
    </div>
  );
}
