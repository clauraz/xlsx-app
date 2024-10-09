import React from "react";
import * as XLSX from "xlsx";

function FileInput() {
  const [data, setData] = React.useState([]);
  const [processEnabled, setProcessEnabled] = React.useState(false);

  function removeDuplicates() {
    var result = [];

    data.forEach(function (a) {
      if (!this[a.__EMPTY_1]) {
        this[a.__EMPTY_1] = { cod: a.__EMPTY_1, iesiri: 0, stoc: 0 };
        result.push(this[a.__EMPTY_1]);
      }

      const toAddIesiri = a.__EMPTY_3 ? a.__EMPTY_3 : 0;
      const toAddStoc = a.__EMPTY_4 ? a.__EMPTY_4 : 0;

      this[a.__EMPTY_1].iesiri += toAddIesiri;
      this[a.__EMPTY_1].stoc += toAddStoc;
    }, Object.create(null));

    return result;
  }

  const processFile = (event, numberOfCharsToIgnore) => {
    const workbook1 = XLSX.read(event.target.result, { type: "binary" });
    const sheetName1 = workbook1.SheetNames[0];
    const sheet1 = workbook1.Sheets[sheetName1];
    const sheetData1 = XLSX.utils.sheet_to_json(sheet1);

    const newSeetData1 = sheetData1.slice(2).map((item) => {
      if (item.__EMPTY_1) {
        return {
          ...item,
          __EMPTY_1: item.__EMPTY_1.slice(numberOfCharsToIgnore),
        };
      } else {
        return item;
      }
    });

    setData((prev) => [...prev, ...newSeetData1]);
  };

  const handleSubmit = (e) => {
    setData([]);
    e.preventDefault();
    const file1 = e.target[0].files[0];
    const file2 = e.target[1].files[0];
    const numberOfCharsToIgnore = parseInt(e.target[2].value);

    const reader = new FileReader();
    const reader2 = new FileReader();

    reader.onload = (event) => {
      processFile(event, numberOfCharsToIgnore);
    };

    reader2.onload = (event) => {
      processFile(event, numberOfCharsToIgnore);
    };
    reader.readAsArrayBuffer(file1);
    reader2.readAsArrayBuffer(file2);

    setProcessEnabled(true);
  };

  const handleDownload = () => {
    const result = removeDuplicates();

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(result);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Totaluri");

    XLSX.writeFile(workbook, "Totaluri.xlsx", { compression: true });
  };

  return (
    <div>
      <form
        id="xlsx-form"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <label>
          <b>Fisier 1:</b>
          <input
            required
            id="xlsx-1"
            type="file"
            style={{ marginLeft: "10px", width: "180px" }}
          />
        </label>
        <label>
          <b>Fisier 2:</b>
          <input
            required
            id="xlsx-2"
            type="file"
            style={{ marginLeft: "10px", width: "180px" }}
          />
        </label>
        <label>
          Ignora
          <input
            required
            id="xlsx-3"
            type="number"
            defaultValue={0}
            min={0}
            style={{ width: "35px", marginLeft: "10px", marginRight: "10px" }}
          ></input>
          caractere
        </label>
        {data && (
          <div style={{ width: "100px", marginTop: "50px" }}>
            <button
              type="submit"
              disabled={data.length > 0}
              style={{
                height: "30px",
                width: "100px",
              }}
            >
              Adauga fisierele
            </button>
          </div>
        )}
      </form>
      <button
        disabled={!processEnabled}
        style={{
          height: "50px",
          width: "100px",
          marginTop: "20px",
        }}
        onClick={handleDownload}
      >
        Descarca fisierul nou
      </button>
    </div>
  );
}

export default FileInput;
