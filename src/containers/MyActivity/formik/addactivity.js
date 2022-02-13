/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import HeadingText from 'utils/HeadingText/headingtext';
import HeadingTwo from 'utils/HeadingTwo/headingtwo';
import Tabs from 'utils/Tabs/tabs';
import Buttons from 'utils/Buttons/buttons';
import { Formik } from 'formik';
import HeadingThree from 'utils/HeadingThree/headingthree';

import PreviewLayoutModel from 'containers/MyProject/model/previewlayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UploadImageV2 from 'utils/uploadimagev2/uploadimagev2';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import BackButton from '../../../assets/images/left-arrow.svg';
import UploadFile from 'utils/uploadselectfile/uploadfile';
import { useSelector, useDispatch } from 'react-redux';
import { editResourceMetaDataAction } from 'store/actions/resource';
import * as actionTypes from 'store/actionTypes';
import { educationLevels, subjects } from 'components/ResourceCard/AddResource/dropdownData';
// import { subjects, educationLevels } from 'components/ac /dropdownData';

const AddActivity = (props) => {
  const { setActivityMethod, changeScreenHandler, setUploadImageStatus, activtyMethod } = props;
  const { layout, selectedLayout, activity, singleLayout } = useSelector((state) => state.myactivities);
  const [modalShow, setModalShow] = useState(false);
  const [upload, setupload] = useState(false);
  const [activeRadio, setActiveRadio] = useState('');

  const [title, setTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const dispatch = useDispatch();
  const [existingActivity, setExistingActivity] = useState(false);
  const [formData, setFormData] = useState('');
  const formRef = useRef();
  var counter;
  useEffect(() => {
    if (selectedLayout) {
      setTitle(selectedLayout.title);
    }
  }, [selectedLayout]);
  useEffect(() => {
    if (activity && setActivityMethod) {
      setActivityMethod('create');
    }
  }, [activity]);
  successMessage &&
    setInterval(() => {
      setSuccessMessage(false);
    }, 5000);
  return (
    <>
      <PreviewLayoutModel
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        formData={formData}
        searchName="abstract"
        setSuccessMessage={setSuccessMessage}
      />
      <div className="add-activity-form">
        {activtyMethod === 'upload' ? (
          <div className="add-activity-tabs">
            <Tabs text="1. Describe and upload activity" tabActive={true} />
          </div>
        ) : (
          <div className="add-activity-tabs">
            <Tabs text="1. Select  layout" tabActive={true} />
            {
              ((counter = 0),
              layout?.map((data) => {
                if (data.id === selectedLayout?.id && counter == 0) {
                  counter++;
                  return (
                    <>
                      <Tabs text="2. Describe and  create layout" className="ml-10" tabActive={true} />
                    </>
                  );
                }
              }))
            }
            {counter === 0 && (
              <>
                <Tabs text="2. Select activity" className="ml-10" tabActive={true} />
                <Tabs text="3. Describe and  create activity" className="ml-10" tabActive={true} />
              </>
            )}
          </div>
        )}

        {!activity && (
          <div className="add-activity-title-select upload-back-button">
            <div className="add-activity-title ">
              <div>
                <HeadingTwo text={activtyMethod === 'upload' ? 'Upload activity' : title} color="#084892" />
              </div>
            </div>
            <div
              className="back-button"
              onClick={() => {
                changeScreenHandler('layout', 'create');
              }}
            >
              <img src={BackButton} alt="back button " />
              <p className="">Back to options</p>
            </div>
            {activtyMethod !== 'upload' && singleLayout === null && (
              <div className="activity-title-change-layout">
                <select
                  onChange={(e) => {
                    dispatch({
                      type: actionTypes.SET_SELECTED_ACTIVITY,
                      payload: JSON.parse(e.target.value),
                    });
                  }}
                >
                  {/* <option value="">Change Layout</option> */}
                  {layout?.map((data) => {
                    return (
                      <option key="" selected={data.title === title ? true : false} value={JSON.stringify(data)}>
                        {data.title}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        )}
        {/* {!activity && (
          <form className="radio-group">
            <div className={activtyMethod !== 'upload' ? 'radio-button active-radio' : 'radio-button'}>
              <input
                onClick={() => {
                  changeScreenHandler('layout', 'create');
                }}
                name="selecttype"
                type="radio"
                className="input"
                id="Create new activity"
                checked={activtyMethod !== 'upload' ? true : false}
              />
              <label for="Create new activity">Create new activity</label>
            </div>
            <div className={activtyMethod === 'upload' ? 'radio-button active-radio' : 'radio-button'}>
              <input
                onClick={() => {
                  changeScreenHandler('addactivity', 'upload');
                }}
                name="selecttype"
                type="radio"
                className="input"
                checked={activtyMethod === 'upload' ? true : false}
                id="Upload activity"
              />
              <label for="Upload activity">Upload activity</label>
            </div>
          </form>
        )} */}
        <div className="add-activity-layout-formik-videoTag">
          <div className="add-activity-layout-formik">
            <Formik
              initialValues={{
                education_level_id: activity?.education_level_id || '',
                subject_id: activity?.subject_id || '',
                thumb_url: activity?.thumb_url || 'https://images.pexels.com/photos/5022849/pexels-photo-5022849.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
                title: activity?.title || '',
              }}
              enableReinitialize
              innerRef={formRef}
              validate={(values) => {
                const errors = {};
                if (!values.title) {
                  errors.title = 'Required';
                } else if (values.title.length > 255) {
                  errors.title = 'Length should be less then 255';
                }

                return errors;
              }}
              onSubmit={(values) => {
                setFormData(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <h4 className="interactive-video-heading-two">Describe layout</h4>

                  <div className="layout-title-formik-textField">
                    <HeadingThree text="Title" color="#515151" className="textField-title" />
                    <HeadingText text="Used for searching, reports and copyright information" color="#515151" className="textField-detailText" />
                    <input type="text" name="title" placeholder="Give your layout a name..." onChange={handleChange} onBlur={handleBlur} value={values.title} />
                    <div style={{ color: 'red' }}>{errors.title && touched.title && errors.title}</div>
                  </div>
                  <div className="layout-formik-select">
                    <div className="formik-select mr-32">
                      <HeadingText text="Subject" className="formik-select-title" />
                      <select name="subject_id" onChange={handleChange} onBlur={handleBlur} value={values.subject_id}>
                        <option hidden>Select</option>
                        {subjects.map((data) => (
                          <option key={data.value} value={data.subject}>
                            {data.subject}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="formik-select ">
                      <HeadingText text="Education level" className="formik-select-title" />
                      <select name="education_level_id" onChange={handleChange} onBlur={handleBlur} value={values.education_level_id}>
                        <option hidden>Select</option>
                        {educationLevels.map((data) => (
                          <option key={data.value} value={data.name}>
                            {data.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="formik-uploadimage">
                    <UploadImageV2 formRef={formRef} setUploadImageStatus={setUploadImageStatus} thumb_url={activity?.thumb_url} />
                  </div>
                </form>
              )}
            </Formik>
          </div>
          <div className="add-activity-layout-videoTag">
            <HeadingThree
              text={activtyMethod === 'upload' ? 'Upload existing activity' : activity ? 'Edit layout' : 'Create layout'}
              color="#084892"
              className="layout-add-activity-title"
            />

            <HeadingText
              text={
                activtyMethod === 'upload'
                  ? 'Upload an activity from an existing H5P file. '
                  : activity
                  ? 'Start editing activity by opening the editor. Once you finish, hit the Save & Close button to see your results.'
                  : 'Start adding activity by opening the editor. Once you finish, hit the Save & Close button to see your results.'
              }
              color="#515151"
            />
            <div className="d-flex">
              {activtyMethod !== 'upload' && (
                <div className="add-activity-btns">
                  <Buttons
                    text="Open Editor"
                    primary={true}
                    width="142px"
                    height="35px"
                    onClick={() => {
                      formRef.current.handleSubmit();
                      if (formRef.current.values.title && formRef.current.values.title.length < 255) {
                        setModalShow(true);
                      }
                    }}
                    hover={true}
                    className="mr-10"
                  />
                </div>
              )}
              {activity && (
                <div className="add-activity-btns">
                  <Buttons
                    text="Save"
                    secondary={true}
                    width="142px"
                    height="35px"
                    onClick={async () => {
                      await formRef.current.handleSubmit();
                      if (formRef.current.values.title && formRef.current.values.title.length < 255) {
                        dispatch(editResourceMetaDataAction(activity, formRef.current.values));
                      }
                    }}
                    hover={true}
                    className="ml-3"
                  />
                </div>
              )}
            </div>

            {activtyMethod === 'upload' && (
              <div className="existing-activity-dialog">
                <UploadFile metadata={formData} formRef={formRef} />
              </div>
            )}

            {successMessage && (
              <div className="successMessage">
                <HeadingThree text="Changes saved succesfully!" color="#12B347" />
                <HeadingText text="To continue editing Open the editor again." color="#12B347" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddActivity;
