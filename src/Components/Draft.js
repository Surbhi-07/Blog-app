import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { postActionCreators } from '../Actions/index'
import { toast } from 'react-toastify';
import MainImage from '../assets/main_image1.jpeg'
import { Link } from 'react-router-dom';
import '../styles/Draft.css'
import CustomizedDialogs from './Dialog';
import AlertDialogBox from './AlertDialogBox';
import renderHTML from 'react-render-html';

export default function DraftPost() {

  const navigate = useNavigate()
  const { authtoken } = useSelector((state) => state.userReducer);
  const { privatePosts } = useSelector((state) => state.postReducer);

  const dispatch = useDispatch()
  const { setPrivatePosts } = bindActionCreators(postActionCreators, dispatch)

  const [id,setId] = useState(null)
  const [title,setTitle] = useState(null)
  const [text,setText] = useState(null)

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenDialog2, setIsOpenDialog2] = useState(false);

  const dialogClose = () => {
    setIsOpenDialog(false);
  };

  const dialogClose2 = () => {
    setIsOpenDialog2(false);
  };

  const dialogOpen = (id,title,text) => {
    const startingIndex = text.indexOf('>')
    const endingIndex = text.indexOf('</')
    setId(id)
    setTitle(title)
    setText(text.slice(startingIndex+1,endingIndex))
    setIsOpenDialog(true);
  };

  const dialogOpen2 = (id) => {
    setId(id)
    setIsOpenDialog2(true);
  };

  useEffect(() => {
    if (!authtoken) {
      toast.info("Login First to see posts")
      navigate('/login')
    } else {
      axios.post('http://localhost:7000/posts/draft', { authtoken }).then(response => {
        ;
        const privatepost = response.data.filter(post => post.visibility === true ? null : post);
        setPrivatePosts(privatepost)
      }).catch(error => {
        toast.error(error.response.data.msg)
      })
    }
  }, [privatePosts,isOpenDialog])

  return (
    <div className='container mt-3'>
      <h1 className='my-2' style={{color:'blue'}}>Your Drafts</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {privatePosts.length ? privatePosts.map(item => (
          <div className="col" key={item._id}>
            <div className="card" style={{borderRadius:'15px'}}>
              <div className="card-body" style={{backgroundColor:'black',color:'white'}}>
                <h5 className="card-title">{item.title}</h5>
                <div className="card-text">{renderHTML(item.text)}</div>
              </div>
              <div className='card-footer'>
                <i style={{fontSize:'20px',color:'blueviolet'}} className='fa fa-pen' onClick={()=>dialogOpen(item._id,item.title,item.text)} ></i>
                <i style={{fontSize:'20px',color:'red'}} className='fas fa-trash-alt' onClick={()=>dialogOpen2(item._id)}></i>
              </div>
            </div>
          </div>
        )) : <div className='container mt-3'>
          <div className="card" style={{ width: '18rem' }}>
            <img src={MainImage} className="card-img-top" alt="..." />
            <div className="card-body">
              <p className="card-text">No Post Available</p>
              <Link className='btn btn-primary' to="/post">Publish Post</Link>
            </div>
          </div>
        </div>}
      </div>
      <CustomizedDialogs isOpenDialog={isOpenDialog} handleClose={dialogClose} title={title} text={text} id={id}/>
      <AlertDialogBox isOpenDialog={isOpenDialog2} handleClose={dialogClose2} id={id}/>
    </div>
  )
}
