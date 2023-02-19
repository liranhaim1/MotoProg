import { useState,useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment/moment";
import CircularProgressWithLabel from "./Percentage";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { mapStateToProps, mapDispatchToProps } from "../../store";
import { connect } from "react-redux";
import { useEffect } from "react";
import { getHistory, addHistory } from "../../features/history";

function QuizHistory(props) {
  const userId = props.user.id;
  const email = props.user.email;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  

  useEffect(() => {
    async function getData() {
      const rowsRes = await getHistory(userId);
      setRows(rowsRes);
      setLoading(false);
    }
    getData();
  }, [userId]);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aDate = moment(a.date.toDate());
      const bDate = moment(b.date.toDate());
      return bDate.diff(aDate);
    });
  }, [rows]);

  // const rows = [
  //   {
  //     date: new Date(),
  //     category: "Python",
  //     score: 67,
  //     correct_count: 5,
  //     incorrect_count: 2,
  //     hints_used: 0,
  //     hints_50_used: 0,
  //   },
  // ];

  // const sortedRows = rows.sort((a, b) => a.date.getTime() - b.date.getTime()); // sort by date

  return (
    <>
      <div className="bg-blur" />
      <h1 className="title">MY HISTORY</h1>

      <TableContainer
        component={Paper}
        className={classNames("table-container")}
      >
        <span>Game history of {email}</span>
        <Table sx={{ minWidth: 650 }} className="table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Score</TableCell>
              <TableCell align="center">Correct</TableCell>
              <TableCell align="center">Incorrect</TableCell>
              <TableCell align="center">Hints</TableCell>
              <TableCell align="center">Fifty hints</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularProgress className="table-loading" />
          ) : (
            <TableBody>
              {sortedRows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {moment(new Date(row.date.toDate())).calendar()}
                  </TableCell>
                  <TableCell align="center">
                    <span className="col-category">{row.category} </span>
                  </TableCell>
                  <TableCell align="center">
                    <CircularProgressWithLabel value={(row.correctCount/(row.correctCount + row.wrongCount))*100} />
                  </TableCell>
                  <TableCell align="center">
                    <span className="correct-count">{row.correctCount}</span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="wrong-count">{row.wrongCount}</span>
                  </TableCell>
                  <TableCell align="center">{row.hintsCount}</TableCell>
                  <TableCell align="center">{row.hints50Count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <ul className="links">
        <Link to="/">Back to Home</Link>
        <Link to="/play/category">Categories</Link>
      </ul>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizHistory);
