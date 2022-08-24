import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";

const imageSrcRoute = "https://i.imgur.com/kb7520L.png";

export default function about() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="about" />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current="about" />
        <div className="mx-auto mb-4 flex flex-col sm:w-3/5">
          <h2 className="my-4 font-mono font-medium">
            вартість та реквізит (буде як окрема вкладка...)
          </h2>
          <p className="mb-4">Фото студія, бул. Вацлава Гавела 4, 90 м²</p>
          <div className="mb-4">
            Що входить у вартість та який є реквізит:
            <ul>
              {[
                "2 світла godox fv150",
                "чорно-білі прапори",
                "бумажні фони",
                "вентилятор",
                "диван на коліщатках",
                "стільці",
                "крісло",
                "стіл на коліщатках",
                "дзеркало",
                "матрац",
                "килим",
                "блекаут штори",
                "колонка jbl",
                "пульверизатор",
                "відпарювач",
                "гардероб",
              ].map((good) => (
                <li key={good}>
                  <span className="bg-white">- {good}</span>
                </li>
              ))}
            </ul>
          </div>
          <h2 className="mb-4 font-mono font-medium">
            контакти (буде як окрема вкладка...)
          </h2>
          <p className="mb-4">
            {/* TODO: Embed instagram photo+video stories instead of a link */}
            Як нас знайти
            <a
              className="text-stone-900 underline hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/stories/highlights/17893954031170001/"
            >
              (відео)
            </a>
          </p>
          <img
            className="mb-4 aspect-[27/12] w-full bg-stone-100"
            src={imageSrcRoute}
            alt="Route"
          />
          <p className="mb-4">
            Прохідна з сірими воротами ліворуч від "Silver Centre"
          </p>
          <p className="mb-4">
            {"-> "}йдіть прямо вниз до останнього корпусу
            <br />
            {"-> "}перед ним ліворуч та з правого боку будуть вхідні двері
            <br />
            {"-> "}піднімайтесь на 4й поверх та знайдіть нас
          </p>

          <p className="mb-4">
            <span className="mb-2 block">
              Наш Телеграм:{" "}
              <a
                className="mb-2 text-stone-900 underline hover:text-stone-400"
                target="_blank"
                rel="noreferrer"
                href="https://t.me/escp90"
              >
                https://t.me/escp90
              </a>
            </span>
            <span className="mb-2 block">
              Наш Інстаграм:{" "}
              <a
                className="mb-2 text-stone-900 underline hover:text-stone-400"
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/escp.90/"
              >
                https://www.instagram.com/escp.90/
              </a>
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
