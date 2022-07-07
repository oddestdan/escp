import NavBar from "../../navbar";

export default function booking() {
  return (
    <div className="flex w-full justify-center">
      <main className="flex w-3/5 flex-col items-center font-mono">
        <NavBar active="booking" />

        <div className="flex w-full flex-col font-light">
          <h1 className="my-4 font-bold">бронювання</h1>
          <ul>
            Booking steps / Booking Summary
            <li>Час (слоти / календар)</li>
            <li>Категорія, чекліст</li>
            <li>Інфо</li>
            <li>Оплата</li>
            <li>Успіх</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
