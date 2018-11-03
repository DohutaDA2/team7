import * as business from "../hoc/business/business";

describe("Tinh lai suat", () => {
  test("STK 10.000.000 co ky han 12 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 12)).toBe(500000);
  });

  test("STK 10.000.000 co ky han 6 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 6)).toBe(250000);
  });

  test("STK 10.000.000 co ky han 3 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 3)).toBe(125000);
  });

  test("STK 10.000.000 co ky han 1 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 1)).toBe(41666);
  });

  test("STK 10.000.000 khong ky han, lai suat 0.5%, gui 365 ngay", () => {
    expect(business.calculateUnLimit(10000000, 0.5, 670)).toBe(93055);
  });
});

describe("Tinh so du STK", () => {
  test("STK 10.000.000 co ky han 12 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("2017/1/1"),
        12,
        true,
        new Date("2018/11/2"),
        "t00"
      )
    ).toBe(10500000);
  });

  test("STK 10.000.000 co ky han 6 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("2017/1/1"),
        6,
        true,
        new Date("2018/11/2"),
        "t00"
      )
    ).toBe(10250000);
  });

  test("STK 10.000.000 co ky han 3 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("2017/1/1"),
        3,
        true,
        new Date("2018/11/2"),
        "t00"
      )
    ).toBe(10125000);
  });

  test("STK 10.000.000 co ky han 1 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("2017/1/1"),
        1,
        true,
        new Date("2018/11/2"),
        "t00"
      )
    ).toBe(10041666);
  });

  test("STK 10.000.000 khong ky han, lai suat 0.5%, gui 365 ngay", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("2017/1/1"),
        0,
        true,
        new Date("2018/11/2"),
        "t00"
      )
    ).toBe(10093055);
  });
});
