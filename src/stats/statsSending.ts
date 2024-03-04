import { googleSheets } from "../utils/googleClient";
import { PersonalInfo } from "../personalInfo/entity/personalInfo.entity";
import { sheetId, spreadSheetId } from "../utils/consts";

const StatsSending = async (
  username: PersonalInfo["username"],
  incomingMessagesStats: number,
  newUsersCount: number,
  averageMessagesCount: number,
  keywordsDiffArr: [],
  time: string,
) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 3);
    const formattedDate = currentDate
      .toISOString()
      .split("T")[0]
      .replace(/-/g, ".");
    const activityToInsert: { userEnteredValue: { stringValue: string } }[] =
      [];
    const countToInsert: { userEnteredValue: { numberValue: number } }[] = [];

    keywordsDiffArr.forEach(
      (item: { activity: string; count: number; keyword: string }) => {
        activityToInsert.push({
          userEnteredValue: {
            stringValue: item.activity,
          },
        });

        countToInsert.push({
          userEnteredValue: {
            numberValue: item.count,
          },
        });
      },
    );

    const sheets = await googleSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetId,
      range: "A1:P",
    });
    const lastFilledCell = res.data.values.length;
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadSheetId,
      requestBody: {
        requests: [
          {
            updateCells: {
              range: {
                sheetId: sheetId,
                startRowIndex: lastFilledCell,
                endRowIndex: lastFilledCell + 2,
                startColumnIndex: 0,
                endColumnIndex: 6 + keywordsDiffArr.length,
              },
              fields: "userEnteredValue.numberValue",
              rows: [
                {
                  values: [{}, {}, {}, {}, {}, {}, ...activityToInsert],
                },
                {
                  values: [
                    {
                      userEnteredValue: {
                        stringValue: formattedDate,
                      },
                    },
                    {
                      userEnteredValue: {
                        stringValue: time,
                      },
                    },
                    {
                      userEnteredValue: {
                        stringValue: username,
                      },
                    },
                    {
                      userEnteredValue: {
                        numberValue: incomingMessagesStats,
                      },
                    },
                    {
                      userEnteredValue: {
                        numberValue: newUsersCount,
                      },
                    },
                    {
                      userEnteredValue: {
                        numberValue: averageMessagesCount,
                      },
                    },
                    ...countToInsert,
                  ],
                },
              ],
            },
          },
        ],
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export default StatsSending;
