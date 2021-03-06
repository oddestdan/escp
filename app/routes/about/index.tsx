import NavBar from "~/components/NavBar/NavBar";
import WithBackgroundOverlay from "~/components/withBackgroundOverlay/withBackgroundOverlay";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";

export default function about() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 font-mono">
      <NavBar active="about" />

      <div className="flex w-full flex-col font-light">
        <Header current="about" />
        <WithBackgroundOverlay
          imageSrc="https://i.imgur.com/jEWMZeu.jpg"
          imageAlt="Proposed goods"
        >
          <p className="my-4">
            <span className="bg-white">90 м2</span>
          </p>
          <div className="my-4">
            <span className="bg-white">
              що входить у вартість та який є реквізит:
            </span>
            <ul>
              {[
                "2 світла godox fv150 ",
                "чорно-білі прапори ",
                "бумажні фони",
                "вентилятор",
                "диван на коліщатках",
                "стільці",
                "крісло",
                "стіл на коліщатках ",
                "дзеркало",
                "матрац",
                "килим",
                "блекаут штори",
                "колонка jbl",
                "пульверизатор",
                "відпарювач",
                "гардероб ",
              ].map((good) => (
                <li key={good}>
                  <span className="bg-white">- {good}</span>
                </li>
              ))}
            </ul>
          </div>
        </WithBackgroundOverlay>
      </div>

      <Footer />
    </main>
  );
}
