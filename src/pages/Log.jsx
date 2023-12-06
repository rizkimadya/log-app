import React, { useState, useEffect } from "react";
import LogTable from "../component/LogTable";

const Log = () => {
	const [logData, setLogData] = useState([]);
	const [selectedLogFile, setSelectedLogFile] = useState(null);

	useEffect(() => {
		// Parse seluruh query string
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		// Ekstrak nilai parameter logFile dari query string
		const logFileParam = urlParams.get("logFile");

		if (logFileParam) {
			// Setel nilai parameter logFile
			setSelectedLogFile(logFileParam);
		} else {
			console.error("Tidak ada parameter logFile ditemukan pada URL.");
		}
	}, []); // Jalankan efek ini sekali saat komponen dipasang

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (selectedLogFile) {
					// Konstruksi URL untuk file log
					const response = await fetch(selectedLogFile);
					const data = await response.text();

					const logArray = data
						.split("\n")
						.filter(line => line.trim() !== "")
						.map(line => JSON.parse(line));

					setLogData(logArray);
				}
			} catch (error) {
				console.error("Error fetching log data:", error);
			}
		};

		fetchData();
	}, [selectedLogFile]);

	const tableHeaders = logData.length > 0 ? Object.keys(logData[0]) : [];

	return (
		<div>
			<h1 style={{ textAlign: "center" }}>Log Data</h1>
			{logData.length > 0 ? (
				<LogTable logData={logData} tableHeaders={tableHeaders} />
			) : (
				<p>No log data available.</p>
			)}
		</div>
	);
};

export default Log;
