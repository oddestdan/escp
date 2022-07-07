import NavBar from "../../navbar";

export default function about() {
  return (
    <div className="flex w-full justify-center">
      <main className="flex w-3/5 flex-col items-center font-mono">
        <NavBar active="about" />
        <div className="flex w-full flex-col font-light">
          <h1 className="my-4 font-bold">про нас</h1>
          <p className="my-4">90 м2</p>

          <p className="my-4">
            що входить у вартість та який є реквізит:
            <ul>
              <li>- 2 світла godox fv150 </li>
              <li>- чорно-білі прапори </li>
              <li>- бумажні фони</li>
              <li>- вентилятор</li>
              <li>- диван на коліщатках</li>
              <li>- стільці</li>
              <li>- крісло</li>
              <li>- стіл на коліщатках </li>
              <li>- дзеркало</li>
              <li>- матрац</li>
              <li>- килим</li>
              <li>- блекаут штори</li>
              <li>- колонка jbl</li>
              <li>- пульверизатор</li>
              <li>- відпарювач</li>
              <li>- гардероб </li>
            </ul>
          </p>
        </div>
      </main>
    </div>
  );
}
