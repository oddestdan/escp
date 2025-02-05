import { studiosData, studiosImagesNumbered } from "~/utils/studiosData";

const room1Items = [
  "диван на коліщатках",
  "паперові фони",
  "лавка",
  "вентилятор",
  "стіл",
  "крісло",
  "дзеркало",
  "столик на коліщатках",
  "флет з фанери",
  "стільці",
  "драбина",
  "матрац",
  "дерев'яний ящик",
  "тканини",
  "рейл для одягу",
  "колонка jbl",
  "пульверизатор",
  "відпарювач",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
  "чорно-білі прапори",
  "фрост рама 1,5х2 м",
  "два спалахи godox qs-600 та один godox qs-400",
  "два постійних світла: godox litemons la200d та la200bis",
  "софтбокси, зонт на просвіт, кольорові фільтри",
];
const Studio1Description = () => (
  <div className="my-4">
    <p className="font-medium">room1</p>
    <br />
    <p className="font-medium">90 м²</p>
    <br />
    Зала з бетонною підлогою. 4 великих деревʼяних вікна, виходять на південь.
    <br />
    Блекаут штори.
    <br />
    Можна встановити на стійки паперовий фон на вибір.
    <br />
    В залі є пересувний флет з фанери.
    <br />
    Висота стель 4,3 м
    <br />
    <br />
    Що входить у вартість та який є реквізит:
  </div>
);

const room2Items = [
  "вентилятор",
  "дерев'яний ящик",
  "лавка",
  "драбина",
  "стіл на коліщатках",
  "дзеркало",
  "диван на коліщатках",
  "стільці",
  "паперові фони: чорний, сірий та оливковий",
  "матрац",
  "рейл для одягу",
  "пульверизатор",
  "відпарювач",
  "колонка jbl",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
  "чорно-білі прапори",
  "фрострама 1,8x1,8 м",
  "три спалахи profoto d1 500air",
  "два постійних світла: godox litemons la200d та la200bi",
  "софтбокси, портретна тарілка для profoto, зонт на просвіт, кольорові фільтри",
];
const Studio2Description = () => (
  <div className="my-4">
    <p className="font-medium">room 2</p>
    <br />
    <p className="font-medium">90 м²</p>
    <br />
    Зала з циклорамою та паркетом. 4 великих деревʼяних вікна, виходять на
    південь.
    <br />
    Блекаут штори.
    <br />
    Три паперових фони закріплені на стіні: чорний, сірий та оливковий.
    <br />
    Розмір циклорами 7,3 x 5,7 м
    <br />
    Висота стель 4,3 м
    <br />
    <br />
    Що входить у вартість та який є реквізит:
  </div>
);

const room3Items = [
  "стілець",
  "лавка",
  "крісло на коліщатах",
  "матрац",
  "стіл",
  "килим",
  "чорно-білі прапори",
  "вентилятор",
  "дзеркало",
  "світильник",
  "табурети",
  "рейл для одягу",
  "колонка jbl",
  "колонка jbl",
  "відпарювач",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
];
const Studio3Description = () => (
  <div className="my-4">
    <p className="font-medium">room 3</p>
    <br />
    <p className="font-medium">45 м²</p>
    <br />
    Зала з деревʼяною підлогою. 2 великих деревʼяних вікна, виходять на північ.
    <br />
    Штори на просвіт.
    <br />
    Висота стель 4,3 м
    <br />
    <br />
    Що входить у вартість та який є реквізит:
  </div>
);

export const room1Data = {
  images: studiosImagesNumbered[0],
  items: room1Items,
  Description: Studio1Description,
  Additional: () => (
    <p className="my-4">
      Також додатково на зйомку можна орендувати два постійних світла aputure
      600d
      <br />
      1 год - 250 грн/шт
      <br />
      від 3х год - 650 грн/шт
    </p>
  ),
  data: studiosData[0],
};

export const room2Data = {
  images: studiosImagesNumbered[1],
  items: room2Items,
  Description: Studio2Description,
  Additional: () => (
    <p className="my-4">
      Також додатково на зйомку можна орендувати два постійних світла aputure
      600d
      <br />
      1 год - 250 грн/шт
      <br />
      від 3х год - 650 грн/шт
    </p>
  ),
  data: studiosData[1],
};

export const room3Data = {
  images: studiosImagesNumbered[2],
  items: room3Items,
  Description: Studio3Description,
  Additional: () => (
    <p className="my-4">
      В залі тимчасово відсутнє студійне світло.
      <br />
      Додатково на зйомку можна орендувати два постійних світла aputure 600d 1
      <br />
      год - 250 грн/шт
      <br />
      від 3х год - 650 грн/шт
    </p>
  ),
  data: studiosData[2],
};

export const studiosDataArr = [room1Data, room2Data, room3Data];
