import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TablePagination,
	TextField,
	Paper,
	Grid,
	Button,
	Typography,
	Modal,
	Box,
	IconButton,
	FormControlLabel,
	Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	borderRadius: "14px",
	boxShadow: 24,
	p: 4,
};

const LogTable = ({ logData, tableHeaders }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState("");

	const [open, setOpen] = React.useState(false);
	const [selectedColumns, setSelectedColumns] = useState(tableHeaders);
	const [columnOrder, setColumnOrder] = useState(tableHeaders);
	const [deactivatedColumns, setDeactivatedColumns] = useState([]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [open2, setOpen2] = React.useState(false);
	const handleOpen2 = () => setOpen2(true);
	const handleClose2 = () => setOpen2(false);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleUpButtonClick = () => {
		// Set the column order to only include selected columns
		const selectedColumnsOrder = tableHeaders.filter(col =>
			selectedColumns.includes(col)
		);
		setColumnOrder(selectedColumnsOrder);
		handleClose();
	};

	const handleColumnToggle = column => {
		if (selectedColumns.includes(column)) {
			setSelectedColumns(selectedColumns.filter(col => col !== column));
			setDeactivatedColumns(prev => [...prev, column]);
		} else {
			setSelectedColumns([...selectedColumns, column]);
			setDeactivatedColumns(prev => prev.filter(col => col !== column));
		}
	};

	const handleReset = () => {
		// Reset the selected columns and column order to initial state
		setSelectedColumns(tableHeaders);
		setColumnOrder(tableHeaders);
		setDeactivatedColumns([]);
		handleClose();
	};

	const filteredData = logData
		.filter(log =>
			Object.values(log).some(
				value =>
					typeof value === "string" && value.toLowerCase().includes(searchTerm)
			)
		)
		.map(log => {
			const filteredLog = {};
			columnOrder.forEach(header => {
				filteredLog[header] = log[header];
			});
			return filteredLog;
		});

	return (
		<Paper style={{ padding: "20px" }}>
			<Grid container spacing={2}>
				<Grid item xs={9} style={{ alignItems: "center", display: "flex" }}>
					<Grid container spacing={2}>
						<Grid item>
							<Button variant="contained" color="primary" onClick={handleOpen}>
								<AlignVerticalCenterIcon />
							</Button>
							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
							>
								<Box sx={style}>
									<IconButton
										edge="end"
										color="inherit"
										onClick={handleClose}
										aria-label="close"
										sx={{ position: "absolute", top: 0, right: 10 }}
									>
										<CloseIcon />
									</IconButton>
									<Typography
										id="modal-modal-title"
										variant="h6"
										component="h2"
									>
										Selection Colom
									</Typography>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "14px",
											alignItems: "center",
											marginTop: "20px",
										}}
									>
										{tableHeaders.map(header => (
											<FormControlLabel
												key={header}
												control={
													<Switch
														checked={selectedColumns.includes(header)}
														onChange={() => handleColumnToggle(header)}
														color="primary"
													/>
												}
												label={header}
											/>
										))}
										<div style={{ marginTop: "20px", gap: "10px" }}>
											<Button
												variant="contained"
												color="inherit"
												onClick={handleReset}
											>
												Reset
											</Button>
											<Button
												variant="contained"
												color="primary"
												onClick={handleUpButtonClick}
											>
												Up
											</Button>
										</div>
									</div>
								</Box>
							</Modal>
						</Grid>
						<Grid item>
							<Button variant="contained" color="primary" onClick={handleOpen2}>
								<ArrowDownwardIcon />
							</Button>
							<Modal
								open={open2}
								onClose={handleClose2}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
							>
								<Box sx={style}>
									<IconButton
										edge="end"
										color="inherit"
										onClick={handleClose2}
										aria-label="close"
										sx={{ position: "absolute", top: 0, right: 10 }}
									>
										<CloseIcon />
									</IconButton>
									<Typography
										id="modal-modal-title"
										variant="h6"
										component="h2"
									>
										Sorting
									</Typography>
									<div
										style={{
											display: "flex",
											gap: "14px",
											justifyContent: "center",
											marginTop: "20px",
										}}
									>
										<Button
											variant="contained"
											color="inherit"
											onClick={handleClose2}
										>
											Reset
										</Button>
										<Button variant="contained" color="primary">
											Up
										</Button>
									</div>
								</Box>
							</Modal>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={3}>
					<TextField
						label="Search"
						variant="outlined"
						fullWidth
						margin="normal"
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value.toLowerCase())}
					/>
				</Grid>
			</Grid>
			<Table>
				<TableHead>
					<TableRow>
						{columnOrder.map(header => (
							<TableCell key={header}>{header}</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredData
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((log, index) => (
							<TableRow key={index}>
								{columnOrder.map(header => (
									<TableCell key={header}>
										{header === "level" ? (
											<LogLevelText level={log[header]} />
										) : (
											log[header]
										)}
									</TableCell>
								))}
							</TableRow>
						))}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={filteredData.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

const LogLevelText = ({ level }) => {
	let levelText = "";

	switch (level) {
		case "panic":
			levelText = "PANIC";
			return (
				<Typography style={{ backgroundColor: "red", color: "white" }}>
					{levelText}
				</Typography>
			);
		case "fatal":
			levelText = "FATAL";
			return (
				<Typography style={{ backgroundColor: "white", color: "red" }}>
					{levelText}
				</Typography>
			);
		case "error":
			levelText = "ERROR";
			return <Typography style={{ color: "red" }}>{levelText}</Typography>;
		case "warn":
			levelText = "WARN";
			return (
				<Typography style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
					{levelText}
				</Typography>
			);
		case "info":
			levelText = "INFO";
			return <Typography style={{ color: "yellow" }}>{levelText}</Typography>;
		case "debug":
			levelText = "DEBUG";
			return <Typography style={{ color: "cyan" }}>{levelText}</Typography>;
		case "trace":
			levelText = "TRACE";
			return (
				<Typography style={{ color: "lightgray" }}>{levelText}</Typography>
			);
		default:
			return levelText;
	}
};

LogTable.propTypes = {
	logData: PropTypes.array.isRequired,
	tableHeaders: PropTypes.array.isRequired,
};

export default LogTable;
