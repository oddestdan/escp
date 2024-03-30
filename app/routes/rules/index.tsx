import NavBar from "~/components/NavBar/NavBar";
import Footer from "~/components/Footer/Footer";

export default function rules() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="rules" />

      <div className="flex w-full flex-1 flex-col font-light">
        <h1 className="mx-auto mt-8 flex w-full justify-between font-medium text-stone-900 sm:w-3/5">
          Правила
        </h1>
        <div className="my-4 mx-auto flex flex-col sm:w-3/5">
          <p className="mt-2">
            <span className="bg-white">
              Бронювання здійснюється після повної оплати. Оплата за бронювання
              студії не повертається.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              Перенести бронювання дозволяється один раз та не менш ніж за 48
              годин до зйомки. В інших випадках оплата згорає.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              Під час зйомки в студії має знаходитись не більше 6 людей, якщо на
              зйомці більше 6 учасників команди – доплата 50 грн/год за людину.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              У залі можна знаходитись тільки в змінному взутті або в наших
              капцях.
            </span>
          </p>
          {/* --- */}
          <p className="mt-12">
            <span className="bg-white">
              Фактичний час оренди при бронюванні однієї години – 55 хвилин.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              За 5 хвилин до кінця бронювання (в 50 хвилин) адміністратор
              попереджує про завершення зйомки. За цей час учасники повинні
              переодягтися, зібрати свої речі та розставити реквізит на свої
              місця. Здавати зал адміністратору потрібно в чистому вигляді.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              В 55 хвилин зала повинна бути вільна для підготовки до наступної
              зйомки.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              Інші нюанси (використання блискіток, олії, землі і т.п.) потрібно
              обов'язково узгоджувати з адміністратором та закладати додатковий
              час для прибирання.
            </span>
          </p>
          {/* --- */}
          <p className="mt-12">
            <span className="bg-white">
              Розгортати та переставляти паперові фони можна виключно в
              присутності адміністратора та з його допомогою.
              <br />
              Штраф за псування фону 300 грн/м.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              Штрафи за псування обладнання та реквізиту визначаються
              адміністратором.
            </span>
          </p>
          {/* --- */}
          <h2 className="mt-12 flex w-full justify-between font-medium text-stone-900 sm:w-3/5">
            Правила користування циклорамою
          </h2>
          <p className="mt-2">
            <span className="bg-white">
              Перебувати на циклорамі можна виключно в змінному чистому та
              сухому взутті, в наших капцях або босоніж.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              Використовувати диван на циклорамі заборонено!
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              Штраф за забруднення циклорами 500-1000 грн, в залежності від
              об’єму забруднення.
            </span>
          </p>
          <p className="mt-2">
            <span className="bg-white">
              Штраф за пошкодження циклорами визначається адміністратором,
              враховуючи ремонтні роботи, матеріали та простій залу.
            </span>
          </p>
          {/* --- */}
          <p className="mt-12">
            <span className="border-b-2 border-red-500 bg-white">
              Замовник має ознайомити всіх учасників зйомки з правилами.
            </span>
          </p>
          <p className="mt-2">
            <span className="border-b-2 border-red-500 bg-white">
              При бронюванні студії замовник погоджується з вищезазначеними
              правилами та бере на себе повну відповідальність за все що
              відбувається на знімальному майданчику.
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
