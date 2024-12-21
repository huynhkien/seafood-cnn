import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const TabPane = ({ images }) => {
  return (
    <Tabs defaultActiveKey="tab-0" id="fill-tab-example" className="mb-3" fill>
      {images?.map((el, index) => (
        <Tab
          key={index}
          eventKey={`tab-${index}`}
          title={<img src={el} alt={`Tab ${index}`} style={{ width: '50px' }} />}
        >
          <img src={el} alt={`Tab ${index}`} style={{ width: '100%'}}/>
        </Tab>
      ))}
    </Tabs>
  );
};

export default TabPane;
