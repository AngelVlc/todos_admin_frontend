import React from "react";
import { PageSelector } from "../PageSelector";
import { PageSizeSelector } from "../PageSizeSelector";
import { TableColumnHeader } from "../TableColumnHeader";

export const TableWithSelectors = (props) => {
  const onSelectAll = (newCheckedValue) => {
    const newData = [...props.rows].map((row) => {
      row[props.selectedColumnName] = newCheckedValue;
      return row;
    });

    props.changeSelected(newData);
  };

  const onChangeItemSelected = (newCheckedValue, index) => {
    const newData = [...props.rows];
    newData[index].selected = newCheckedValue;

    props.changeSelected(newData);
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            {props.columns.map((column) => (
              <TableColumnHeader
                key={column.title}
                column={column}
                paginationInfo={props.paginationInfo}
                changePagination={props.changePagination}
              />
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
                {props.columns.map((column) => (
                  <td key={column.name}>{row[column.name]}</td>
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
      <div className="level">
        <div className="level-left">
          <PageSelector
            paginationInfo={props.paginationInfo}
            changePagination={props.changePagination}
          />
          <PageSizeSelector
            paginationInfo={props.paginationInfo}
            changePagination={props.changePagination}
          />
        </div>
      </div>
    </div>
  );
};
