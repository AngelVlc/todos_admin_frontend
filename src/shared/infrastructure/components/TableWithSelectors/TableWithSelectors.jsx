import React from "react";

export const TableWithSelectors = (props) => {
  const onSelectAll = (newCheckedValue) => {
    const newData = [...props.rows].map((row) => {
      row[props.selectedColumnName] = newCheckedValue;
      return row;
    });

    props.onSelectedChanged(newData);
  };

  const onChangeItemSelected = (newCheckedValue, index) => {
    const newData = [...props.rows];
    newData[index].selected = newCheckedValue;

    props.onSelectedChanged(newData);
  };

  return (
    <table className="table">
      <thead>
        <tr>
          {/* <td>Id
              <span class="icon">Id
                <i class="fas fa-thin fa-sort-up"></i>
              </span>
            </td> */}

          {props.columnTitles.map((columnTitle) => (
            <td key={columnTitle}>{columnTitle}</td>
          ))}
          <td>
            <center>
              <input
                type="checkbox"
                data-testid="toggleSelectAll"
                defaultChecked={false}
                onChange={(e) => onSelectAll(e.target.checked)}
              ></input>
            </center>
          </td>
        </tr>
      </thead>
      <tbody>
        {props.rows.length > 0 &&
          props.rows.map((row, index) => (
            <tr key={index}>
              {props.columnNames.map((columnName) => (
                <td key={columnName}>{row[columnName]}</td>
              ))}
              <td>
                <center>
                  <input
                    type="checkbox"
                    data-testid={`checkBoxItem${row[props.idColumnName]}`}
                    checked={row[props.selectedColumnName]}
                    onChange={(e) =>
                      onChangeItemSelected(e.target.checked, index)
                    }
                  ></input>
                </center>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
