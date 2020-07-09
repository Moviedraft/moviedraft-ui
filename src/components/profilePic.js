import React, { Component } from 'react'
import '../styles/profilePic.css'
import S3 from 'aws-s3'
import { apiPatch } from '../utilities/apiUtility.js'

class ProfilePic extends Component {
  constructor(props){
    super(props)
    this.state = {
      maxFileSize: 50000,
      imageLoaded: false,
      selectedFile: null,
      filePreviewUrl: null
    }

    this.config = {
      bucketName: process.env.REACT_APP_BUCKET_NAME,
      dirName: process.env.REACT_APP_DIR_NAME,
      region: process.env.REACT_APP_REGION,
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      contentType:'image/*'
    }
    this.s3Client = new S3(this.config)

    this.previewImage = this.previewImage.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.resetStates = this.resetStates.bind(this)
  }

  previewImage(event) {
    let file = event.target.files[0]

    if (file === undefined) {
      return null
    }

    if (file.size > this.state.maxFileSize) {
      alert('File can not be larger than 50kb.')
      return null
    }

    this.setState({selectedFile: file})
    this.setState({filePreviewUrl: URL.createObjectURL(file)})
  }

  uploadImage() {
    let newFileName = this.props.userId

    this.s3Client.uploadFile(this.state.selectedFile, newFileName)
    .then(data => {
      if (data.location === this.props.picture) {
        this.props.updateProfilePic(data.location)
        this.resetStates()
      } else {
        let body = {
          'picture': data.location
        }
        apiPatch('users/current', body)
        .then(data => {
          if (data !== null) {
            this.props.updateProfilePic(data.picture)
            this.resetStates()
          }
        })
      }
    })
    .catch(err => console.error(err))
  }

  resetStates() {
    this.setState({selectedFile: null})
    this.setState({filePreviewUrl: null})
  }

  renderUploadProcess() {
    if (this.state.selectedFile !== null && this.state.filePreviewUrl !== null) {
      return (
        <div id='uploadButtons'>
          <button onClick={event => this.uploadImage(event)}>
            Upload
          </button>
          <button onClick={this.resetStates}>
            Cancel
          </button>
        </div>
      )
    }

    return (
      <div id='selectImage'>
        <label htmlFor='files'>CHANGE PIC</label>
        <input
          id='files'
          type='file'
          onChange={this.previewImage} />
      </div>
    )
  }

  render() {
    return (
      <div id='pofilePicWrapper'>
        <img
          id='picture'
          key={Date.now()}
          style={this.state.imageLoaded ? {} : {display: 'none'}}
          onLoad={() => this.setState({imageLoaded: true})}
          src={this.state.filePreviewUrl ?? this.props.picture}
          alt='Profile' />
        <div id='upload'>
          {this.renderUploadProcess()}
        </div>
      </div>
    )
  }
}

export default ProfilePic;
