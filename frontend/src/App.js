import {Route, Routes} from 'react-router-dom';
import {Public, Home, Login, FinalRegister, ForgotPassword, Admin, AddProduct, Search , ManagerCategory, AddCategory, ManagerProduct, EditProduct, ManagerOrder, ManagerUser, Graph, Dashboard, AboutTemplate, ContactTemplate, Category, CartTemplate, CheckOut, Wishlist, User, UserOrder, ProductDetail, ResetPassword, FinalRegisterGoogle, ManagerSupplier, ImportManager, ExportManager, ImportAdd, VoucherManager, VoucherAdd, Voucher, ManagerComment, IdentifyTemplate, ManagerRole, AddRole, AddVoucherProduct, NotFound} from './ui/Index';
import path from './utils/path';
import Modal from 'react-modal';
import { customStyles } from './utils/contant';
import { ToastContainer } from 'react-toastify';


// Import css
import './assets/style.css'
import './assets/admin.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import UserOrderDetail from './ui/public/order/UserOrderDetail';
import { Loading } from './components/Index';
import { useEffect } from 'react';
import ChatTemplate from './ui/admin/chat/ChatTemplate';



function App() {
  const { isShowModal, modalType } = useSelector(state => state.app);

  const renderModalContent = () => {
    switch (modalType) {
      case 'loading':
        return <Loading />;
      default:
        return null;
    }
  };
  useEffect(() => {
    Modal.setAppElement('#root'); 
  }, []);
  return (
    <div className='app' >
      {isShowModal && <Modal style={customStyles} isOpen={isShowModal}>{renderModalContent()}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public/>}>
          <Route path={path.HOME} element={<Home/>}/>
          <Route path={path.LOGIN} element={<Login/>}/>
          <Route path={path.FINAL_REGISTER} element={<FinalRegister/>}/>
          <Route path={path.FINAL_REGISTER_GOOGLE} element={<FinalRegisterGoogle/>}/>
          <Route path={path.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
          <Route path={path.RESET_PASSWORD} element={<ResetPassword/>}/>
          <Route path={path.ABOUT} element={<AboutTemplate/>}/>
          <Route path={path.CONTACT} element={<ContactTemplate/>}/>
          <Route path={path.CATEGORY} element={<Category/>}/>
          <Route path={path.SEARCH} element={<Search/>}/>
          <Route path={path.CART} element={<CartTemplate/>}/>
          <Route path={path.CHECKOUT} element={<CheckOut/>}/>
          <Route path={path.WISHLIST} element={<Wishlist/>}/>
          <Route path={path.USER} element={<User/>}/>
          <Route path={path.ORDER} element={<UserOrder/>}/>
          <Route path={path.ORDER_DETAIL} element={<UserOrderDetail/>}/>
          <Route path={path.PRODUCT_DETAIL} element={<ProductDetail/>}/>
          <Route path={path.VOUCHER} element={<Voucher/>}/>
          <Route path={path.IDENTIFY} element={<IdentifyTemplate/>}/>
          
        </Route>
        <Route path={path.ADMIN} element={<Admin/>}>
          <Route path={path.DASHBOARD} element={<Dashboard/>}/>
          <Route path={path.MANAGER_PRODUCT} element={<ManagerProduct/>}/>
          <Route path={path.ADD_PRODUCT} element={<AddProduct/>}/>
          <Route path={path.EDIT_PRODUCT} element={<EditProduct/>}/>
          <Route path={path.MANAGER_CATEGORY} element={<ManagerCategory/>}/>
          <Route path={path.ADD_CATEGORY} element={<AddCategory/>}/>
          <Route path={path.MANAGER_ORDER} element={<ManagerOrder/>}/>
          <Route path={path.MANAGER_USER} element={<ManagerUser/>}/>
          <Route path={path.MANAGER_SUPPLIER} element={<ManagerSupplier/>}/>
          <Route path={path.MANAGER_IMPORT} element={<ImportManager/>}/>
          <Route path={path.MANAGER_VOUCHER} element={<VoucherManager/>}/>
          <Route path={path.ADD_VOUCHER} element={<VoucherAdd/>}/>
          <Route path={path.ADD_RECEIPT} element={<ImportAdd/>}/>
          <Route path={path.MANAGER_COMMENT} element={<ManagerComment/>}/>
          <Route path={path.GRAPH} element={<Graph/>}/>
          <Route path={path.MANAGER_ROLE} element={<ManagerRole/>}/>
          <Route path={path.ADD_ROLE} element={<AddRole/>}/>
          <Route path={path.MESSAGE} element={<ChatTemplate/>}/>
        </Route>
        <Route path="*" element={<NotFound />} />
        
      </Routes>
      <ToastContainer
          limit={1}
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          containerId="GlobalApplicationToast"
          />
       <ToastContainer />
    </div>
  );
}

export default App;