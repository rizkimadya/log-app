import React, { useState, useEffect } from "react";
import LogTable from "../component/LogTable";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
} from "@mui/material";
import FileLog from "../assets/file/1693575435_migration.log";
import FileLog2 from "../assets/file/1693576497_migration.log";
import FileLog3 from "../assets/file/exec-sql_1694152972.log";

const Log = () => {
	const [logData, setLogData] = useState([]);
	const [selectedLogFile, setSelectedLogFile] = useState({
		label: "Migration Log 1",
		value: FileLog,
	});
	const [availableLogFiles] = useState([
		{ label: "Migration Log 1", value: FileLog },
		{ label: "Migration Log 2", value: FileLog2 },
		{ label: "Excel SQL Log", value: FileLog3 },
	]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(selectedLogFile.value);
				const data = await response.text();

				const logArray = data
					.split("\n")
					.filter(line => line.trim() !== "")
					.map(line => JSON.parse(line));

				setLogData(logArray);
			} catch (error) {
				console.error("Error fetching log data:", error);
			}
		};

		fetchData();
	}, [selectedLogFile]);

	const handleLogFileChange = event => {
		const selectedValue = event.target.value;
		const selectedOption = availableLogFiles.find(
			logFile => logFile.value === selectedValue
		);
		setSelectedLogFile(selectedOption);
	};

	const tableHeaders = logData.length > 0 ? Object.keys(logData[0]) : [];

	return (
		<div>
			<h1 style={{ textAlign: "center" }}>Log Data</h1>
			<FormControl sx={{ m: 1, minWidth: 300 }}>
				<InputLabel id="log-file-select-label">Select Log File</InputLabel>
				<Select
					labelId="log-file-select-label"
					id="log-file-select"
					value={selectedLogFile.value}
					onChange={handleLogFileChange}
					label="Select Log File"
				>
					{availableLogFiles.map(logFile => (
						<MenuItem key={logFile.value} value={logFile.value}>
							{logFile.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			{logData.length > 0 && (
				<LogTable logData={logData} tableHeaders={tableHeaders} />
			)}
		</div>
	);
};


export default Log;
