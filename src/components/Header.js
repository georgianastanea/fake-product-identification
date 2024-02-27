import React, { useState } from 'react';
import { Menu, MenuItem, MenuMenu, Dropdown, Message } from 'semantic-ui-react'; 
import { useDispatch, useSelector } from 'react-redux';
import 'semantic-ui-css/semantic.min.css'; 
import { loadAccount } from '../store/interactions';

const Header = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [error, setError] = useState(null);
  const options = [
    { key: 1, text: 'Localhost', value: "0x7a69" },
    { key: 2, text: 'Sepolia', value: "0xaa36a7" },
  ];

  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const networkHandler = async (e, { value }) => {
    try{
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: value,
                }
            ]
        });
    }
    catch(err){
        setError(err.message);
        setTimeout(() => {
            setError(null); 
          }, 2000);
    }
  };

  const connectHandler = async() => {
    await loadAccount(provider, dispatch);
  };

  const handleAccount = () => {
    if(account){
      return account.substring(0, 6) + "..." + account.substring(account.length - 4);
    }
    else{
      return "Connect";
    }
  };

  return (
    <div>
        <Menu stackable style={{ marginTop: '10px' }}>
            <MenuItem
              name='home'
              active={activeItem === 'home'}
              onClick={handleItemClick}
            >
              Home
            </MenuItem>

            <Dropdown
              search
              selection
              options={options}
              placeholder='Choose a network'
              onChange={networkHandler}
            />

            <MenuMenu position='right'>
              <MenuItem
                name='connect'
                active={activeItem === 'connect'}
                onClick={connectHandler}
              >
                {handleAccount()}
              </MenuItem>
            </MenuMenu>
        </Menu>
        {error && <Message negative content={error} />}
    </div>
    
  );
}

export default Header;