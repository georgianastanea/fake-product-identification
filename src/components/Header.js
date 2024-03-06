import React, { useState } from 'react';
import { Menu, MenuItem, MenuMenu, Dropdown, Message } from 'semantic-ui-react'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'; 
import { loadAccount } from '../store/interactions';
import config from '../config.json';

const Header = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const options = [
    { key: 1, text: 'Localhost', value: "0x7a69" },
    { key: 2, text: 'Sepolia', value: "0xaa36a7" },
    { key: 5, text: 'Goerli', value: "0x5" },
  ];

  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);
  const chainId = useSelector((state) => state.provider.chainId);

  const handleHomeClick = (e, { name }) => {
    navigate('/');
  };
  
  const networkHandler = async (e, { value }) => {
    try{
        console.log('chainId:', chainId);
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
              onClick={handleHomeClick}
            >
              Home
            </MenuItem>

            <Dropdown
              search
              selection
              options={options}
              placeholder='Choose a network'
              onChange={networkHandler}
              value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            />

            <MenuMenu position='right'>
              <MenuItem
                name='connect'
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