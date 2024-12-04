import React, { useState, useEffect } from 'react';
import { apiClient, getAuth } from "../../utils/authUtils";
import { useParams, useNavigate } from "react-router-dom";
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
import QRCode from "react-qr-code";

const Registrants = () => {
    const { id } = useParams();
    const [registrants, setRegistrants] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!getAuth()) {
            navigate("/");
        }

        const fetchRegistrants = async () => {
            try {
                const response = await apiClient.get(
                    `/api/registrants?event_id=${id}&page=${page + 1}&per_page=${rowsPerPage}`
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
                                <TableCell><QRCode
                                    size={256}
                                    style={{ height: "auto" }}
                                    value={registrant.id}
                                    viewBox={`0 0 256 256`}
                                  /></TableCell>
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
