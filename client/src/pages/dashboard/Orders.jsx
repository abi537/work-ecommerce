// import { useCallback, useEffect, useState } from 'react'
// import Heading from '../../components/ui/Heading';
// import { Divider, Box, Container } from '@mui/material';
// import OrderHistoryTable from '../../components/Order/OrderHistoryTable';
// import { useMounted } from '../../hooks/use-mounted';
// import { orderApi } from '../../api/orderApi';
// import { toast } from 'react-hot-toast';
// import useAuth from '../../hooks/useAuth';
// function Orders() {
//   const [orders, setOrders] = useState([])
//   const isMounted = useMounted()
 
//   const GetAllOrders = useCallback(async () => {
//     try {
//       toast.promise(
//         orderApi.GetAllOrders(),
//         {
//           loading: 'Fetching data...',
//           error: 'Error while fetching data',
//         },
//         { id: 'fetching', success: { style: { display: 'none' } } }
//       )
//         .then((response) => {
//           if (isMounted()) {
//             setOrders(response);
//           }
//         })
//         .catch((error) => {
//           if (isMounted()) {
//             console.error(error);
//           }
//         });
//     } catch (err) {
//       console.error(err);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     GetAllOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
  
//   return (
//     <>
//       <Container maxWidth='xl' sx={{ marginBottom: '14px' }}>
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginLeft: '1rem',
//             marginRight: '1rem',
//             marginTop: '1rem',
//           }}
//         >
//           <Heading title={`orders (${orders?.length})`} description={``} />
//         </Box>
//         <Divider
//           sx={{
//             marginY: 2,
//             marginLeft: '1rem',
//             marginRight: '1rem',
//           }} />
//         <OrderHistoryTable data={orders} />
//       </Container >

//     </>
//   )
// }

// export default Orders

import { useCallback, useEffect, useState } from 'react'
import Heading from '../../components/ui/Heading';
import { Divider, Box, Container } from '@mui/material';
import OrderHistoryTable from '../../components/Order/OrderHistoryTable';
import { useMounted } from '../../hooks/use-mounted';
import { orderApi } from '../../api/orderApi';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

function Orders() {
  const [orders, setOrders] = useState([])
  const isMounted = useMounted()
  const { user } = useAuth();

  const GetAllOrders = useCallback(async () => {
    try {
      toast.promise(
        orderApi.GetAllOrders(),
        {
          loading: 'Fetching data...',
          error: 'Error while fetching data',
        },
        { id: 'fetching', success: { style: { display: 'none' } } }
      )
        .then((response) => {
          if (isMounted()) {
            setOrders(response);
          }
        })
        .catch((error) => {
          if (isMounted()) {
            console.error(error);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    GetAllOrders();
  }, [GetAllOrders]);

  return (
    <Container maxWidth='xl' sx={{ marginBottom: '14px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginLeft: '1rem',
          marginRight: '1rem',
          marginTop: '1rem',
        }}
      >
        <Heading title={`orders (${orders?.length})`} description={``} />
      </Box>
      <Divider
        sx={{
          marginY: 2,
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
      />
      <OrderHistoryTable
        data={orders}
        userRole={user?.role}  // ✅ Pass role
        onOrderUpdate={(updatedOrder) => {
          setOrders(prev => prev.map(order => order._id === updatedOrder._id ? updatedOrder : order));
        }}
      />
    </Container>
  );
}

export default Orders;
