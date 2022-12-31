import type { Appointment } from "@prisma/client";
import { google } from "googleapis";

export type GoogleAppointment = Pick<
  Appointment,
  "date" | "timeFrom" | "timeTo" | "confirmed"
>;

export const CAL_ID = process.env.GOOGLE_CALENDAR_ID;

const plsDontLookHere =
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDv/52MxcXU4bwA\n9LJj1hHZ2bFJiK0iOj3noGLlDT8RLhKS38EFEuVtJXrqLGVx/K3eq6B2UxT8q/0l\nHH/+NcQNIQBaoPlG2gmICxFhyn6f9kghhRLY++ngAVS8sYKnK7o5YFCzL5DpJIHJ\nTY5U/THkA0+LOMwR9eakmFkRf2MjH+8++2eft7C/ZLlrU1wsEVYIhqEfFgt1SGty\nQBrbntIxB3QaEmJHZHJDxZbLlGIhsewd1dPOqy3s/UJyh9wQUd//4szj2u6u8LHu\nFAZcIzYfzUr/YOh+p3zIFOv5uoriqukjHdHx2wGwUIg/xznBJAdnxADrIqCI+gcl\njlNZQ5p/AgMBAAECggEARkmE4Tj8ttuDfX4sjoufv77/KouCNR98iM0SmYV3Hndx\nTh2EwJEnqv8Kj/F/plH7s9Zs0KqFX3iZU1iU7aTebX/oRCKXztXFa9fd99dfnUZ6\nGoMIIY8pkAajw/1yx7XJPMuF5ux70qPz9LongKGEjoQftCTmsy3ipfrOPw8hQCQl\nc5jYbWGCD+Se9+O5+K7bov6iJgkGCJ9iEB2+uGHugCzz75ivlQK7f0442vYfcypU\nVEp9/glRrIB2jia8o1dxd8HkLoBJXCCwZP3Sb3H3VVF8D7+eYQOux/9F6q+I8ttW\nPiuBbavYjGDRa8L4+sl1IkIygLEuR6gJ/J5z/5IAXQKBgQD4rc8GnLyJOP618mLt\nv3gOujIMviTHdspea/TxY9b6cMOnlEYHhSWvcyO5InAeEVw2jkt86CxYajrsIm8B\nvzOgUrCp3x2ZsHgsXPqNK349jEHCgVxsW2NK2Cxwl3IugbHIF/dlRlinuJ84INix\nPf/3qe6aICL0L/pTSCwH2IGyIwKBgQD3EGLDgjYwP8/pSI202WlDwpRYkBblvYE8\ndDhUxHwNUHzUf36XrUD9Aetcp5MjTxKDYdIUeIi4owBlvJAweL5rONF91l1C5wJE\noQrBjQsukG0qHEudLICEqanjes4Qd8buRd+SkS02iFYyuSAZo1AGKzMVRgSWrreJ\nSBZqEq/V9QKBgQDXukgPb2brD8N+6Z/Cqcgn1oTWoxja5IVX9gVOZxM2vR4uQSWj\nHnF7y8GguGxU2TCKr1RzLiJSLQ2ijZiJBmpt2W4iX0iZbApESgCc+K8SC5t8daZM\n5da0NeYPYoIOMDqe35Ohiq4cCcAt++ifka59FjDECb7o4LojB0gTIlIYywKBgDrq\nQWL1zg47aUzr7D7QCXYLFGz6DzvBsOvFmxk7sYlLRDk4Hev1eKXcq09w9nlZBcUm\nsn4HMDM3S4T3Ljsgz+epqOslDyBBDh1nebUl+SCleCKulKlqT0tTWhvQ0QrERT/U\nkbfVvr5eTI/T7X+vngmai5frFnUIPOQTuKSayCtxAoGBAIgNR3cvbopm4MFnKm2X\nl3U9LdL5Luxm+nRylw6YV+MMGvarhEgnnVo5RVOmvSMOpaw7suVyHEPBGEHGSlio\nUPSur9G3Xkp1VQwqD7A+W+kcgCWN/Y2XJN7TCPC+exDw9RA/JZ/XsCRNlHds+ftR\nRoZ6NvDSzz68Q5FvW+Q3+P0x\n-----END PRIVATE KEY-----\n";

// API key credentials
// export const calendar = google.calendar({
//   version: "v3",
//   auth: process.env.GOOGLE_API_KEY,
// });

// Service account credentials
export const calendar = google.calendar("v3");
export const googleAuth = new google.auth.GoogleAuth({
  // keyFile: "./escp90-service-e59744a14000.json",
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: plsDontLookHere, // process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  },
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
  ],
});
