import * as business from "../hoc/business/business";

/********************************************************
 *                                                      *
 *        DONT NEED THE FIRST TEST CASE ANYMORE         *
 *                                                      *
 *******************************************************/

// describe("Tinh lai suat", () => {
//   test("STK 10.000.000 co ky han 12 thang, lai suat 5%", () => {
//     expect(business.calculateLimit(10000000, 5, 12)).toBe(500000);
//   });

//   test("STK 10.000.000 co ky han 6 thang, lai suat 5%", () => {
//     expect(business.calculateLimit(10000000, 5, 6)).toBe(250000);
//   });

//   test("STK 10.000.000 co ky han 3 thang, lai suat 5%", () => {
//     expect(business.calculateLimit(10000000, 5, 3)).toBe(125000);
//   });

//   test("STK 10.000.000 co ky han 1 thang, lai suat 5%", () => {
//     expect(business.calculateLimit(10000000, 5, 1)).toBe(41666);
//   });

//   test("STK 10.000.000 khong ky han, lai suat 0.5%, gui 365 ngay", () => {
//     expect(business.calculateUnLimit(10000000, 0.5, 670)).toBe(93055);
//   });
// });

// describe("Tinh so du STK", () => {
//   test("STK 10.000.000 co ky han 12 thang, lai suat 5%", () => {
//     expect(
//       business.calculate(
//         null,
//         10000000,
//         5,
//         0.5,
//         new Date("2017/1/1"),
//         12,
//         true,
//         new Date("2018/11/2"),
//         "t00"
//       )
//     ).toBe(10500000);
//   });

//   test("STK 10.000.000 co ky han 6 thang, lai suat 5%", () => {
//     expect(
//       business.calculate(
//         null,
//         10000000,
//         5,
//         0.5,
//         new Date("2017/1/1"),
//         6,
//         true,
//         new Date("2018/11/2"),
//         "t00"
//       )
//     ).toBe(10250000);
//   });

//   test("STK 10.000.000 co ky han 3 thang, lai suat 5%", () => {
//     expect(
//       business.calculate(
//         null,
//         10000000,
//         5,
//         0.5,
//         new Date("2017/1/1"),
//         3,
//         true,
//         new Date("2018/11/2"),
//         "t00"
//       )
//     ).toBe(10125000);
//   });

//   test("STK 10.000.000 co ky han 1 thang, lai suat 5%", () => {
//     expect(
//       business.calculate(
//         null,
//         10000000,
//         5,
//         0.5,
//         new Date("2017/1/1"),
//         1,
//         true,
//         new Date("2018/11/2"),
//         "t00"
//       )
//     ).toBe(10041666);
//   });

//   test("STK 10.000.000 khong ky han, lai suat 0.5%, gui 365 ngay", () => {
//     expect(
//       business.calculate(
//         null,
//         10000000,
//         5,
//         0.5,
//         new Date("2017/1/1"),
//         0,
//         true,
//         new Date("2018/11/2"),
//         "t00"
//       )
//     ).toBe(10093055);
//   });
// });

/********************************************************
 *                                                      *
 *                ONLY USE THIS TEST CASE               *
 *                                                      *
 *******************************************************/

describe("Tinh lai suat", () => {
  let log1 = [
    { amount: 100000, time: "01/02/2018" },
    { amount: 1000000, time: "01/07/2018" }
  ];

  test("STK 10.000.000 kỳ hạn 12 tháng, lãi suất 5%, 0.05%, không log, mở ngày 1/1/2018", () => {
    expect(
      business.calculateOneTerm(null, 10000000, 5, 0.5, "01/01/2018", 12)
    ).toEqual({ balance: 10000000, profit: 500000 });
  });

  test("STK 10.000.000 kỳ hạn 12 tháng, lãi suất 5%, 0.05%, có log, mở ngày 1/1/2018", () => {
    expect(
      business.calculateOneTerm(log1, 10000000, 5, 0.5, "01/01/2018", 12)
    ).toEqual({ balance: 8900000, profit: 447556, });
  });

  test("STK 10.000.000 không kỳ hạn, lãi suất 5%, 0.05%, không log, mở ngày 1/1/2018", () => {
    expect(
      business.caclculateProfitUnlimit(
        null,
        10000000,
        5,
        0.5,
        "1/1/2018",
        0,
        true,
        "1/7/2018",
        "p0",
        "e2"
      )
    ).toEqual({ balance: 10000000, profit: 25138 });
  });

  test("STK 123.000.000 không kỳ hạn, lãi suất 0.06%, 0.4%, không log, mở ngày 23/10/2018", () => {
    expect(
      business.caclculateProfitUnlimit(
        null,
        123000000,
        0.06,
        0.4,
        "23/10/2018",
        0,
        false,
        "",
        "p0",
        "e2"
      )
    ).toEqual({ balance: 123000000, profit: 28700, });
  });

  let log2 = [
    { amount: 50000, time: "20/9/2018" },
    { amount: 50000, time: "27/9/2018" }
  ];

  test("Hàm con tính STK 30.000.000 kỳ hạn 1 tháng, lãi suất 4.3%, 0.63%, có log, mở ngày 1/9/2018, đã tất toán", () => {
    expect(
      business.calculateProfitLimit(
        log2,
        30000000,
        4.3,
        0.63,
        "01/09/2018",
        1,
        true,
        "01/10/2018",
        "p1",
        "e2"
      )
    ).toEqual({ balance: 29900000, profit: 107179 });
  });

  test("Hàm con tính STK 10.000.000 kỳ hạn 1 tháng, lãi suất 5%, 0.05%, có log, mở ngày 1/1/2018", () => {
    expect(
      business.calculateOneTerm(log2, 30000000, 4.3, 0.63, "01/09/2018", 1)
    ).toEqual({ balance: 29900000, profit: 107179 });
  });

  test("Hàm cha tính STK 30.000.000 kỳ hạn 1 tháng, lãi suất 4.3%, 0.63%, có log, mở ngày 1/9/2018, đã tất toán", () => {
    expect(
      business.calculate(
        log2,
        30000000,
        4.3,
        0.63,
        "01/09/2018",
        1,
        true,
        "01/10/2018",
        "p1",
        "e2"
      )
    ).toBe(30007179);
  });

  test("Hàm cha tính STK 20.000.000 kỳ hạn 12 tháng, lãi suất 12%, 0.56%, không log, mở ngày 1/1/2018, chưa tất toán", () => {
    expect(
      business.calculate(
        null,
        20000000,
        12,
        0.56,
        "01/01/2018",
        12,
        false,
        "",
        "p0",
        "e0"
      )
    ).toBe(22400000);
  });

  let log3 = [
    { amount: 1000000, time: "12/11/2018" },
    { amount: 1000000, time: "12/11/2018" },
    { amount: 1000000, time: "12/11/2018" },
  ];
  test("Hàm cha tính STK 57.500.000 kỳ hạn 6 tháng, lãi suất 10%, 0.56%, có log, mở ngày 1/1/2018, chưa tất toán", () => {
    expect(
      business.calculate(
        log3,
        55000000,
        10,
        0.56,
        "01/01/2018",
        6,
        false,
        "",
        "p0",
        "e0"
      )
    ).toBe(60243704);
  });

  
  test("Hàm cha tính STK 30.000.000 kỳ hạn 1 tháng, lãi suất 4.3%, 0.63%, không log, mở ngày 1/9/2018, chưa tất toán", () => {
    expect(
      business.calculate(
        null,
        30000000,
        4.3,
        0.63,
        "01/07/2018",
        1,
        false,
        "",
        "p0",
        "e1"
      )
    ).toBe(30537500);
  });
});
