import WithBackgroundOverlay from "~/components/withBackgroundOverlay/withBackgroundOverlay";
import Header from "~/components/Header/Header";
import { NavBar } from "~/components/NavBar/NavBar";

export default function rules() {
  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col items-center p-4 font-mono">
        <NavBar active="rules" />
        <div className="flex w-full flex-col font-light">
          <Header current="rules" />
          <WithBackgroundOverlay
            imageSrc="https://i.imgur.com/QVy6C5f.jpg"
            imageAlt="Admin board"
          >
            <p className="my-4">
              <span className="bg-white">
                бронювання здійснюється після повної оплати. оплата за
                бронювання студії не повертається.
              </span>
            </p>
            <p className="my-4">
              <span className="bg-white">
                перенести бронювання можливо не менш ніж за 48 годин до зйомки.
                в інших випадках оплата згорає.
              </span>
            </p>
            <p className="my-4">
              <span className="bg-white">
                фактичний час оренди при бронюванні однієї години -- 55 хвилин.
              </span>
            </p>
            <p className="my-4">
              <span className="bg-white">
                в залі можна знаходитись тільки в змінному взутті або в наших
                капцях.
              </span>
            </p>
            <p className="my-4">
              <span className="bg-white">
                здавати зал адміністратору потрібно в чистому вигляді та з усіма
                предметами на своїх місцях. інші нюанси (використання блискіток,
                землі і т.п.) потрібно обов'язково узгоджувати з адміністратором
                та закладати додатковий час для прибирання.
              </span>
            </p>
          </WithBackgroundOverlay>
        </div>
      </main>
    </div>
  );
}
