import React from 'react';
import './css/Table.css';

const Table = ({ tableData, totals }) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Total Score</th>
            <th>Average Team Mark</th>
            <th>Achievement (%)</th>
            <th>Achievement Allowance Against Target</th>
            <th>Allocated Allowance (%)</th>
            <th>Allocated Allowance Amount</th>
            <th>Achieved Allowance</th>
            <th>Number of Persons</th>
            <th>Personal Allowance Amount</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.depName}</td>
              <td>{row.totalScore}</td>
              <td>{row.averageTeamMark}</td>
              <td>{row.achievementPercent.toFixed(2)}%</td>
              <td>{row.achievementAllowance}</td>
              <td>{row.allocatedAllowancePercent}</td>
              <td>{row.allocatedAllowanceAmount}</td>
              <td>{row.achievedAllowance}</td>
              <td>{row.numberOfPersons}</td>
              <td>{row.personalAllowanceAmount}</td>
            </tr>
          ))}
          {/* Totals Row */}
          <tr className="total-row">
            <td>Total</td>
            <td></td>
            <td>{totals.averageTeamMark.toFixed(2)}</td>
            <td>{(totals.achievementPercent / tableData.length).toFixed(2)}%</td>
            <td></td>
            <td>{(totals.allocatedAllowancePercent / tableData.length).toFixed(2)}%</td>
            <td>{totals.allocatedAllowanceAmount.toFixed(2)}</td>
            <td>{totals.achievedAllowance.toFixed(2)}</td>
            <td>{totals.numberOfPersons}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
