// import { Button, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
// import { Scrollbar } from "../ui/Scrollbar";
// import { Fragment, useState } from "react";
// import { pagination } from "../../utils/paginations";
// import { useNavigate } from "react-router-dom";
// import { currencyFormatter } from "../../utils/currencyFormatter";
// import { formatDate } from '../../utils/dateFormatter';
// import PropTypes from 'prop-types';
 

// const OrderHistoryTable = (props) => {
//     const { data } = props
//     const navigate = useNavigate();
//     const [page, setPage] = useState(0);
//     const [limit, setLimit] = useState(5);


//     const onPageChange = (event, newPage) => {
//         setPage(newPage);
//     };
//     const onRowsPerPageChange = (event) => {
//         setLimit(parseInt(event.target.value, 10));
//     };
//     const paginatedData = pagination(data, page, limit);

//     return (
//         < >
//             <Card>
//                 <Scrollbar>
//                     <Table sx={{ minWidth: 700 }}>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Order ID  </TableCell>
//                                 <TableCell>Order Owner  </TableCell>
//                                 <TableCell>Order date</TableCell>
//                                 <TableCell>Total Price</TableCell>
//                                  <TableCell>Paid</TableCell>
//                                 <TableCell>delivered</TableCell>
//                                 <TableCell align="right">Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         {paginatedData.length === 0 ? (
//                             <TableBody>
//                                 <TableRow>
//                                     <TableCell colSpan={3} align="center">
//                                         <Typography color="text.primary">   No result </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             </TableBody>
//                         ) : (
//                             <TableBody>
//                                 {paginatedData.map((item) => {
//                                     return (
//                                         <Fragment key={item?._id}>
//                                             <TableRow key={item?._id} hover>
//                                                 <TableCell>
//                                                     <Typography color="text.primary">{item?._id}</Typography>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Typography color="text.primary">{item?.shippingAddress?.fullName}</Typography>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Typography color="text.primary">{formatDate(item?.createdAt)}</Typography>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Typography color="text.primary">{currencyFormatter.format(item?.totalPrice)}</Typography>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Typography color="text.primary">{item?.isPaid
//                                                         ? formatDate(item?.paidAt)
//                                                         : 'No'}
//                                                     </Typography>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Typography color="text.primary"> {item?.isDelivered
//                                                         ? formatDate(item?.deliveredAt)
//                                                         : 'No'}</Typography>
//                                                 </TableCell>
//                                                 <TableCell align="right">
//                                                     <Button type="button" onClick={() => {
//                                                         navigate(`/order/${item?._id}`, { state: { prevPath: location.pathname } });
//                                                     }}>Details</Button>
//                                                 </TableCell>
//                                             </TableRow>
//                                         </Fragment>
//                                     );
//                                 })}
//                             </TableBody>
//                         )}
//                     </Table>
//                 </Scrollbar>
//                 <TablePagination
//                     component="div"
//                     count={data?.length}
//                     onPageChange={onPageChange}
//                     onRowsPerPageChange={onRowsPerPageChange}
//                     page={page}
//                     rowsPerPage={limit}
//                     rowsPerPageOptions={[5, 10, 25]}
//                 />
//             </Card>
//         </>
//     )
// }
// OrderHistoryTable.propTypes = {
//     data: PropTypes.array,
// };
// export default OrderHistoryTable

import { Button, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { Scrollbar } from "../ui/Scrollbar";
import { Fragment, useState } from "react";
import { pagination } from "../../utils/paginations";
import { useNavigate } from "react-router-dom";
import { currencyFormatter } from "../../utils/currencyFormatter";
import { formatDate } from '../../utils/dateFormatter';
import PropTypes from 'prop-types';
import { orderApi } from '../../api/orderApi'; // make sure this has the deliverOrder function
import { toast } from 'react-hot-toast';

const OrderHistoryTable = ({ data, userRole, onOrderUpdate }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const onPageChange = (event, newPage) => setPage(newPage);
    const onRowsPerPageChange = (event) => setLimit(parseInt(event.target.value, 10));
    const paginatedData = pagination(data, page, limit);

    const handleMarkDelivered = async (orderId) => {
        try {
            const updatedOrder = await orderApi.DeliverOrder(orderId);
            toast.success("Order marked as delivered!");
            if (onOrderUpdate) onOrderUpdate(updatedOrder); // update parent state
        } catch (err) {
            toast.error("Failed to mark delivered");
        }
    };

    return (
        <Card>
            <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Order Owner</TableCell>
                            <TableCell>Order date</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Delivered</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {paginatedData.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography>No result</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {paginatedData.map((item) => (
                                <Fragment key={item._id}>
                                    <TableRow hover>
                                        <TableCell>{item._id}</TableCell>
                                        <TableCell>{item.shippingAddress?.fullName}</TableCell>
                                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                                        <TableCell>{currencyFormatter.format(item.totalPrice)}</TableCell>
                                        <TableCell>{item.isPaid ? formatDate(item.paidAt) : 'No'}</TableCell>
                                        <TableCell>{item.isDelivered ? formatDate(item.deliveredAt) : 'No'}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                type="button"
                                                onClick={() => navigate(`/order/${item._id}`)}
                                            >
                                                Details
                                            </Button>

                                            {/* Admin only, show button if order not delivered */}
                                            {userRole === 'ADMIN' && !item.isDelivered && (
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    onClick={() => handleMarkDelivered(item._id)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Mark Delivered
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={data?.length}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={limit}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

OrderHistoryTable.propTypes = {
    data: PropTypes.array.isRequired,
    userRole: PropTypes.string,
    onOrderUpdate: PropTypes.func,
};

export default OrderHistoryTable;
