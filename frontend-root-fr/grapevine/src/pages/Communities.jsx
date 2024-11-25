import * as React from 'react';
import TextField from '@mui/material/TextField';
import {Controller} from 'react-hook-form'
import AxiosInstance from '../Axios';
import '../App.css';



function Communities() {
    // Creation of the use states to be dynamically updated as calls to changes in
    // data
    const [searchTerm, setSearchTerm] = useState('');
    const [userCommunities, setUserCommunities] = useState([]);
    const [allCommunities, setAllCommunities] = useState([]);
    const [currentUserID, setCurrentUserID] = useState(null);
    const [searchResult, setSearchResult] = useState(null);
    const [searchCommunityname, setSearchCommunityname] = useState('');
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [CommuntiyStatus, setCommunityStatus] = useState('');
    const [isLeftCommunityDialogOpen, setIsLeftCommunityDialogOpen] = useState(false);
    const [isCommunityDialogOpen, setIsCommunityDialogOpen] = useState(false);

    useEffect(() =>{
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if(storedUser){
        fetchCurrentUserID();
      }
    }, []);

    const fetchCurrentUserID = async () => {
      try {
        const currentUsername = JSON.parse(localStorage.getItem('user')).username;
        const response = await AxiosInstance.get(`users/?username=${currentUsername}`);
        if (response.data.length > 0) {
          setCurrentUserID(response.data[0].id); // Set current user's ID
        }
      } catch (error) {
        console.error('Error fetching current user ID:', error);
      }
    };

    const fetchCommunities = async (userid) => {
      try{
        // Put in logic for fetching communities
        const response = await AxiosInstance.get();
        setUserCommunities(response.data);
      } catch (error) {
        console.error('Error fetching friends list: ', error);
      }
    };

    useEffect(() => {
      if(userid) {
        fetchCommunities(userid);
      }
    }, [userid]);

    const handleSearchCommunity = async () => {
      try{
        const response = await AxiosInstance.get();
        if(response.data.length > 0){
          setSearchResult(response.data[0]);
          setCommunityStatus('');
        } else{
          setCommunityStatus('Community not Found');
          setSearchResult(null);
        }
      } catch (error) {
        console.error('Error searching for Community: ', error);
      }
    };

    const handleJoinCommunity = async () => {
      if(searchResult) {
        try {
          const fidResponse = await AxiosInstance.get();
          const f_id = fidResponse.data.genString;
          await AxiosInstance.post('', {
            fid: f_id,
            user: currentUserID,
            community: searchResult.id,
          });
          setCommunityStatus(`You have joined ${searchResult.}.`);
          fetchCommunities(userid);
          setSearchCommunityname('');
          setSearchResult(null);
        } catch(error) {
          console.error('Error joining Community: ', error);
        }
      }
    };

    const leaveCommunity = async () => {
      if(selectedCommunity) {
        try{
          await AxiosInstance.post(``, {
            user: currentUserID,
            community: selectedCommunity.id,
          });
          setCommunityStatus(`You have left ${selectedCommunity.name}.`);
          setIsLeftCommunityDialogOpen(false);
          fetchCommunities(userid);
        } catch (erro){
          console.error('Error Leaving Community: ', error);
        }
      }
    };

    const openAddCommunityDialog = () => {
      setIsCommunityDialogOpen(true);
      setIsLeftCommunityDialogOpen(false);
      setSearchCommunityname('');
      setCommunityStatus('');
      setSearchResult(null);
    };

    const openLeaveCommunityDialog = (community) =>{
      setSelectedCommunity(community);
      setIsLeftCommunityDialogOpen(true);
      setCommunityStatus('');
    }


  return (
    <Controller
        name = {name}
        control = {control}
        render ={({
        field:{onChange, value},
        fieldState:{error},
        formState
        }) =>
            (
              <TextField
                  onChange={onChange}
                  value={value}
                  id="standard-basic"
                  label={label}
                  variant="standard"
                  placeholder = {placeholder}
              />
            )
        }
    />
  );
}