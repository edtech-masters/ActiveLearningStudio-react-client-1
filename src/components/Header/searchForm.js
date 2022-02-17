/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Dropdown } from 'react-bootstrap';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Buttons from 'utils/Buttons/buttons';
import { simpleSearchAction } from 'store/actions/search';
import { getActivityItems, loadResourceTypesAction } from 'store/actions/resource';
import { educationLevels, subjects } from 'components/ResourceCard/AddResource/dropdownData';
import { getUserReport } from 'store/actions/admin';
import searchIcon from 'assets/images/Search.svg';

function SearchForm() {
  const history = useHistory();
  const dispatcher = useDispatch();

  const [simpleSearch, setSimpleSearch] = useState('');
  const [activityTypes, setActivityTypes] = useState([]);
  const [value, setValue] = useState(0);
  const activityTypesState = useSelector((state) => state.resource.types);
  const searchState = useSelector((state) => state.search);
  const auth = useSelector((state) => state.auth);
  const { currentOrganization, permission } = useSelector((state) => state.organization);

  useEffect(() => {
    if (activityTypesState.length === 0 && auth?.user) {
      dispatcher(loadResourceTypesAction());
      dispatcher(getActivityItems());
      dispatcher(getUserReport('all'));
    }
  }, []);

  const compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const bandA = a.title.toUpperCase();
    const bandB = b.title.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  };

  useEffect(() => {
    const allItems = [];
    activityTypesState?.data?.map((data) => data?.activityItems?.map((itm) => allItems.push(itm)));
    setActivityTypes(allItems.sort(compare));
    if (searchState?.searchQuery !== simpleSearch) {
      setSimpleSearch('');
    }
  }, [activityTypesState, searchState.searchQuery]);

  const closeModel = useRef();
  return (
    <Dropdown>
      <div className="search-block navbtn">
        <input
          placeholder="Search Library"
          value={simpleSearch}
          onChange={(e) => {
            setSimpleSearch(e.target.value);
          }}
          ref={closeModel}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              if (!simpleSearch.trim()) {
                Swal.fire('Search field is required');
              } else if (simpleSearch.length > 255) {
                Swal.fire('Character limit should be less than 255 ');
              } else if (true) {
                const searchData = {
                  phrase: simpleSearch.trim(),
                  from: 0,
                  size: 20,
                  type: 'public',
                };
                dispatcher(simpleSearchAction(searchData));
                localStorage.setItem('loading', 'true');
                history.push(`/org/${currentOrganization?.domain}/search?q=${simpleSearch.trim()}&type=public`);
                localStorage.setItem('refreshPage', false);
              } else if (permission?.Search?.includes('search:dashboard')) {
                const searchData = {
                  phrase: simpleSearch.trim(),
                  from: 0,
                  size: 20,
                  type: 'private',
                };
                dispatcher(simpleSearchAction(searchData));
                localStorage.setItem('loading', 'true');
                history.push(`/org/${currentOrganization?.domain}/search?q=${simpleSearch.trim()}&type=private`);
                localStorage.setItem('refreshPage', false);
              }
            }
            return true;
          }}
        />
        <img
          onClick={(e) => {
            if (!simpleSearch.trim()) {
              Swal.fire('Search field is required');
            } else if (simpleSearch.length > 255) {
              Swal.fire('Character limit should be less than 255 ');
            } else if (true) {
              const searchData = {
                phrase: simpleSearch.trim(),
                from: 0,
                size: 20,
                type: 'public',
              };
              dispatcher(simpleSearchAction(searchData));
              localStorage.setItem('loading', 'true');
              history.push(`/org/${currentOrganization?.domain}/search?q=${simpleSearch.trim()}&type=public`);
              localStorage.setItem('refreshPage', false);
            } else if (permission?.Search?.includes('search:dashboard')) {
              const searchData = {
                phrase: simpleSearch.trim(),
                from: 0,
                size: 20,
                type: 'private',
              };
              dispatcher(simpleSearchAction(searchData));
              localStorage.setItem('loading', 'true');
              history.push(`/org/${currentOrganization?.domain}/search?q=${simpleSearch.trim()}&type=private`);
              localStorage.setItem('refreshPage', false);
            }
          }}
          alt=""
          className="searchicon"
          src={searchIcon}
        />
        <Dropdown.Toggle variant="" id="dropdown-basic">
          <FontAwesomeIcon icon="chevron-down" />
        </Dropdown.Toggle>
      </div>

      <Dropdown.Menu>
        <div className="overlay-search-form">
          <h4>Advanced Search</h4>
          <Formik
            initialValues={{
              phrase: '',
              subjectArray: [],
              author: [],
              subject: '',
              grade: '',
              gradeArray: [],
              standard: '',
              standardArray: [],
              email: '',
              words: '',
              no_words: undefined,
              type: 'public',
              toDate: undefined,
              fromDate: undefined,
              from: 0,
              size: 20,
              model: undefined,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.phrase && values.type !== 'orgSearch') {
                errors.phrase = 'required';
              }
              if (values.fromDate && values.toDate) {
                if (values.fromDate > values.toDate) {
                  errors.dateError = 'Invalid Date Format';
                }
              }
              if (values.fromDate) {
                if (!values.toDate) {
                  errors.toDate = 'To Date required';
                }
              }
              return errors;
            }}
            onSubmit={(values) => {
              closeModel.current.click();

              // eslint-disable-next-line max-len
              history.push(
                `/org/${currentOrganization?.domain}/search?q=${values.phrase}&type=${values.type}&grade=${values.subjectArray}&education=${values.gradeArray}&h5p=${values.standardArray}&fromDate=${values.fromDate}&toDate=${values.toDate}&author=${values.author}`
              );
              localStorage.setItem('refreshPage', false);

              Swal.showLoading();
              dispatcher(simpleSearchAction(values));
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="radio-btns">
                    {true && (
                      <label>
                        <input name="type" onChange={handleChange} onBlur={handleBlur} value="private" checked={values.type === 'private'} type="radio" />
                        <span>Search My Projects</span>
                      </label>
                    )}
                    {true && (
                      <label>
                        <input name="type" onChange={handleChange} onBlur={handleBlur} value="public" checked={values.type === 'public'} type="radio" />
                        <span>Search All Shared Projects</span>
                      </label>
                    )}
                    {true && (
                      <label>
                        <input name="type" onChange={handleChange} onBlur={handleBlur} value="orgSearch" checked={values.type === 'orgSearch'} type="radio" />
                        <span>Search All Shared Projects In My Org</span>
                      </label>
                    )}
                  </div>
                </div>

                <div
                  className="form-group"
                  // style={{
                  //   display: values.type === 'orgSearch' ? 'none' : 'block',
                  // }}
                >
                  <input name="phrase" placeholder="Enter search phrase" onChange={handleChange} onBlur={handleBlur} value={values.phrase} />
                  <div className="error">{errors.phrase && touched.phrase && errors.phrase}</div>
                </div>

                <div className="form-group">
                  <select
                    name="subject"
                    placeholder="Subject + Subject Area"
                    onChange={(e) => {
                      handleChange(e);
                      let updatedValue = e.target.value;
                      if (updatedValue.includes('&')) {
                        updatedValue = e.target.value.replace('&', 'and');
                        if (!values.subjectArray.includes(updatedValue)) {
                          values.subjectArray.push(updatedValue);
                        }
                      } else if (!values.subjectArray.includes(e.target.value)) {
                        values.subjectArray.push(e.target.value);
                      }
                    }}
                    onBlur={handleBlur}
                    value={values.subject}
                  >
                    <option value="" disabled selected hidden>
                      {' '}
                      Subject + Subject Area
                    </option>
                    {subjects.map((data) => (
                      <option key={data.value} value={data.subject}>
                        {data.subject}
                      </option>
                    ))}
                  </select>
                </div>

                {values.subjectArray.length > 0 && (
                  <div className="form-group wrap-keyword" data-name={value}>
                    {values.subjectArray.map((data) => (
                      <div className="keywords-de">
                        {data}
                        <div
                          className="iocns"
                          onClick={() => {
                            // eslint-disable-next-line no-param-reassign
                            values.subjectArray = values.subjectArray.filter((index) => index !== data);
                            setValue(value + 1);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group">
                  <select
                    name="grade"
                    placeholder="Grade Level"
                    onChange={(e) => {
                      handleChange(e);
                      let updatedValue = e.target.value;
                      if (updatedValue.includes('&')) {
                        updatedValue = e.target.value.replace('&', 'and');
                        if (!values.gradeArray.includes(updatedValue)) {
                          values.gradeArray.push(updatedValue);
                        }
                      } else if (!values.gradeArray.includes(e.target.value)) {
                        values.gradeArray.push(e.target.value);
                      }
                    }}
                    value={values.grade}
                  >
                    <option value="" disabled selected hidden>
                      Education Level
                    </option>
                    {educationLevels.map((data) => (
                      <option key={data.value} value={data.name}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>

                {values.gradeArray.length > 0 && (
                  <div className="form-group wrap-keyword">
                    {values.gradeArray.map((data) => (
                      <div className="keywords-de" data-name={value}>
                        {data}
                        <div
                          className="iocns"
                          onClick={() => {
                            // eslint-disable-next-line no-param-reassign
                            values.gradeArray = values.gradeArray.filter((index) => index !== data);
                            setValue(value + 1);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group">
                  <select
                    name="standard"
                    placeholder="Standard"
                    onChange={(e) => {
                      handleChange(e);

                      let updateValue = e.target.value;
                      if (updateValue.includes('&')) {
                        updateValue = e.target.value.replace('&', 'and');
                        if (!values.standardArray.includes(updateValue)) {
                          values.standardArray.push(updateValue);
                        }
                      } else if (!values.standardArray.includes(e.target.value)) {
                        values.standardArray.push(e.target.value);
                      }
                    }}
                    value={values.standard}
                  >
                    <option value="" disabled selected hidden>
                      Type of Activity
                    </option>
                    {activityTypes?.map((data) => (
                      <option key={data.id} value={data.h5pLib}>
                        {data.title}
                      </option>
                    ))}
                  </select>
                </div>

                {values.standardArray.length > 0 && (
                  <div className="form-group wrap-keyword" data-name={value}>
                    {values.standardArray.map((data) => (
                      <div className="keywords-de">
                        {data}
                        <div
                          className="iocns"
                          onClick={() => {
                            // eslint-disable-next-line no-param-reassign
                            values.standardArray = values.standardArray.filter((index) => index !== data);
                            setValue(value + 1);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group dual">
                  <input
                    name="fromDate"
                    placeholder="From Date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="2005-01-01"
                    max="2050-12-31"
                    value={values.fromDate}
                    onFocus={(e) => {
                      e.target.type = 'date';
                    }}
                  />
                  <input
                    name="toDate"
                    placeholder="To Date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.toDate}
                    min="2005-01-01"
                    max="2050-12-31"
                    onFocus={(e) => {
                      e.target.type = 'date';
                    }}
                  />
                </div>
                <div className="error" style={{ color: 'red', marginTop: '-15px' }}>
                  {errors.toDate && errors.toDate && errors.toDate}
                  {errors.dateError}
                </div>

                <div
                  className="form-group"
                  style={{
                    display: permission?.Organization?.includes('organization:view-user') && values.type !== 'private' ? 'block' : 'none',
                  }}
                >
                  <input name="author" placeholder="Enter author name" onChange={handleChange} onBlur={handleBlur} value={values.author} />
                </div>
                <div className="form-group">
                  <input name="no_words" placeholder="Do not have the words" onChange={handleChange} onBlur={handleBlur} value={values.no_words} />
                </div>
                <div className="dual_activity">
                  <Buttons type="submit" primary text="Search" width="165px" height="35px" hover />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SearchForm;
