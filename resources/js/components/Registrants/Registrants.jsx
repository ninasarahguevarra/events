import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
} from '@mui/material';
import axios from 'axios';

const Registrants = () => {
    const [registrants, setRegistrants] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        // Fetch registrants data whenever page or rowsPerPage changes
        const fetchRegistrants = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(
                    `${apiUrl}/api/registrants?page=${page + 1}&per_page=${rowsPerPage}`
                );
                const { data } = response.data;
                setRegistrants(data.data);
                setTotalRows(data.total);
            } catch (error) {
                console.error('Error fetching registrants:', error);
            }
        };

        fetchRegistrants();
    }, [page, rowsPerPage]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>QR Code</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {registrants.map((registrant) => (
                            <TableRow key={registrant.id}>
                                <TableCell>{registrant.id}</TableCell>
                                <TableCell>{registrant.name}</TableCell>
                                <TableCell>{registrant.email}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </Paper>
    );
};

export default Registrants;
