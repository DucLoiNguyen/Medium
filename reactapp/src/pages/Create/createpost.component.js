import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  CKBox,
  CKBoxImageEdit,
  CloudServices,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  SelectAll,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  Base64UploadAdapter,
  Title
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import { useState, useEffect } from "react";
import axios from "axios";
import TopicApi from "~/api/TopicApi";

function CreatePost() {
  const [ckContent, setCKContent] = useState("");
  const [formData, setFormData] = useState({
    tittle:"",
    subtittle:""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState('');
  const [dataTopic, setDataTopic] = useState(null);
  const [topic, setTopic] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeTopic = (e) => {
    setTopic(JSON.parse(e.target.value));
  }

  // Xử lý khi chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF)');
      return;
    }

    // Kiểm tra kích thước file (max: 5MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 50MB');
      return;
    }

    setSelectedFile(file);

    // Tạo preview cho ảnh
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileImange = new FormData();
    fileImange.append("image", selectedFile);
    setError('');
    const response = await axios.post('http://localhost:3030/api/upload', fileImange, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const data = {...formData, thumbnail: response.data.filePath, content:ckContent, topic: topic};
    console.log(data);
    await axios.post("http://localhost:3030/api/post/createpost", data ).then(res =>{ if (res.status === 200) {alert("thành công")}});
  };

  // // Xử lý upload ảnh
  // const handleUpload = async () => {
  //   if (!selectedFile) {
  //     setError('Vui lòng chọn một file ảnh');
  //     return;
  //   }
  //
  //   setIsUploading(true);
  //   setError('');
  //
  //   try {
  //     const fileData = new FormData();
  //     fileData.append('image', selectedFile);
  //     console.log(typeof (fileData));
  //
  //     const response = await axios.post('http://localhost:3030/api/upload', fileData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //
  //     setUploadedImagePath(response.data.filePath);
  //     alert('Upload ảnh thành công!');
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     setError(error.response?.data?.message || 'Có lỗi xảy ra khi upload ảnh');
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // Xóa ảnh đã chọn
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const responseData = await TopicApi.getAllTopics();
        setDataTopic(responseData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);
  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <div className="w-full">
          <CKEditor
            onChange={(event, editor) => {
              const data = editor.getData();
              setCKContent(data);
            }}
            onBlur={(event, editor) => {
              console.log('Editor không còn focus');
              console.log(ckContent);
            }}
            editor={ClassicEditor}
            config={
              {
                toolbar: {
                  items: ["undo",
                    "redo",
                    "|",
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "link",
                    "insertImage",
                    // "ckbox",
                    "mediaEmbed",
                    "insertTable",
                    "blockQuote",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "todoList",
                    "outdent",
                    "indent"],
                  shouldNotGroupWhenFull: false
                },
                plugins: [
                  AccessibilityHelp,
                  Autoformat,
                  AutoImage,
                  Autosave,
                  BalloonToolbar,
                  BlockQuote,
                  BlockToolbar,
                  Bold,
                  CKBox,
                  CKBoxImageEdit,
                  CloudServices,
                  Essentials,
                  Heading,
                  ImageBlock,
                  ImageCaption,
                  ImageInline,
                  ImageInsert,
                  ImageInsertViaUrl,
                  ImageResize,
                  ImageStyle,
                  ImageTextAlternative,
                  ImageToolbar,
                  ImageUpload,
                  Indent,
                  IndentBlock,
                  Italic,
                  Link,
                  LinkImage,
                  List,
                  ListProperties,
                  MediaEmbed,
                  Paragraph,
                  PasteFromOffice,
                  PictureEditing,
                  SelectAll,
                  Table,
                  TableCaption,
                  TableCellProperties,
                  TableColumnResize,
                  TableProperties,
                  TableToolbar,
                  TextTransformation,
                  TodoList,
                  Title,
                  Underline,
                  Undo,
                  Base64UploadAdapter
                ],
                balloonToolbar: ["bold", "italic", "|", "link", "insertImage", "|", "bulletedList", "numberedList"],
                blockToolbar: ["bold", "italic", "|", "link", "insertImage", "insertTable", "|", "bulletedList", "numberedList", "outdent", "indent"],
                image: {
                  toolbar: ["toggleImageCaption", "imageTextAlternative", "ckboxImageEdit"]
                },
                list: {
                  properties: {
                    styles: true,
                    startIndex: true,
                    reversed: true
                  }
                },
                title: {
                  placeholder: "type the title"
                },
                placeholder: "My custom placeholder for the body",
                initialData: "",
                licenseKey: "T3NUY0pxam5hL01xRVpXNVFZT1A2T2RDT2JnMnFsR1RxKy93cXNZNU9nOHVnakNaUkZtdHp1ck9IS0dPY1E9PS1NakF5TkRFeE1UUT0="
              }
            }
          />
        </div>
      </div>

      <div className="flex justify-center">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div className="col-span-full">
                  <label htmlFor="thumbnail" className="block text-sm/6 font-medium text-gray-900">Story
                    thumbnail</label>
                  <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <div className="text-center">
                        {preview ? (
                          <div className="mt-4">
                            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                              <img
                                src={preview}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-md"
                              />
                            </div>
                          </div>
                        ) : (
                          <svg
                            className="mx-auto size-12 text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                          >
                            <path
                              fillRule="evenodd"
                              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <div className="mt-4 flex text-sm/6 text-gray-600 justify-center">
                          <label
                            htmlFor="thumbnail"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-gray-600 hover:text-gray-400"
                          >
                            <span>Upload a file</span>
                            <input
                              id="thumbnail"
                              name="thumbnail"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {error && (
                    <p className="mt-1 text-sm/6 text-red-600">{error}</p>
                  )}
                </div>

                <div className="col-span-full">
                  <label htmlFor="tittle" className="block text-sm/6 font-medium text-gray-900">Tittle</label>
                  <div className="mt-2">
                    <input type="text" name="tittle" id="tittle" placeholder="Write a preview title"
                           className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 border-0 border-b-2 border-gray-300 sm:text-sm/6 focus:outline-none focus:ring-0 focus:border-none"
                           required
                           onChange={handleChange} />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="subtittle" className="block text-sm/6 font-medium text-gray-900">Subtittle</label>
                  <div className="mt-2">
                    <input type="text" name="subtittle" id="subtittle" placeholder="Write a preview subtitle..."
                           className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 border-0 border-b-2 border-gray-300 sm:text-sm/6 focus:outline-none focus:ring-0 focus:border-none"
                           onChange={handleChange} />
                  </div>
                  <p className="mt-1 text-sm/6 text-gray-600">Note: Changes here will affect how your story appears in
                    public places like Medium’s homepage and in subscribers’ inboxes — not the contents of the story
                    itself.</p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="tag" className="block text-sm/6 font-medium text-gray-900">Topic</label>
                  <div className="mt-2 grid grid-cols-1">
                    <select id="topic" name="topic" onChange={handleChangeTopic}
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                      {dataTopic &&
                        <>
                        {dataTopic.map((item) => (
                          <option key={item._id} value={JSON.stringify({topicId:item._id, topicName:item.topicname})}>{item.topicname}</option>
                        ))}
                        </>
                      }
                    </select>
                    <svg
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm/6 font-semibold text-gray-900">Cancel</button>
            <button type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save
            </button>
            {/*<button*/}
            {/*  className="px-2 py-1 bg-[#1a8917] rounded-full text-white text-sm hover:bg-[#0f730c]">*/}
            {/*  <span>Publish</span>*/}
            {/*</button>*/}
          </div>
        </form>
      </div>

      {/*<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">*/}
      {/*  <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Ảnh</h2>*/}

      {/*  <div className="space-y-6">*/}
      {/*    <div className="flex items-center space-x-3">*/}
      {/*      <label*/}
      {/*        htmlFor="file-input"*/}
      {/*        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 cursor-pointer"*/}
      {/*      >*/}
      {/*        Chọn ảnh*/}
      {/*      </label>*/}
      {/*      <input*/}
      {/*        type="file"*/}
      {/*        id="file-input"*/}
      {/*        onChange={handleFileChange}*/}
      {/*        accept="image/*"*/}
      {/*        className="hidden"*/}
      {/*      />*/}

      {/*      {selectedFile && (*/}
      {/*        <button*/}
      {/*          onClick={handleClear}*/}
      {/*          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"*/}
      {/*        >*/}
      {/*          Xóa*/}
      {/*        </button>*/}
      {/*      )}*/}
      {/*    </div>*/}

      {/*    {error && (*/}
      {/*      <p className="text-red-500">{error}</p>*/}
      {/*    )}*/}

      {/*    {preview && (*/}
      {/*      <div className="mt-4">*/}
      {/*        <h3 className="text-lg font-medium text-gray-700 mb-2">Xem trước:</h3>*/}
      {/*        <div className="border border-gray-200 rounded-md p-2 bg-gray-50">*/}
      {/*          <img*/}
      {/*            src={preview}*/}
      {/*            alt="Preview"*/}
      {/*            className="max-h-64 mx-auto rounded-md"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    )}*/}

      {/*    <button*/}
      {/*      onClick={handleUpload}*/}
      {/*      disabled={!selectedFile || isUploading}*/}
      {/*      className={`w-full py-3 rounded-md text-white font-medium transition duration-300 ${*/}
      {/*        !selectedFile || isUploading*/}
      {/*          ? 'bg-gray-400 cursor-not-allowed'*/}
      {/*          : 'bg-blue-500 hover:bg-blue-600'*/}
      {/*      }`}*/}
      {/*    >*/}
      {/*      {isUploading ? 'Đang upload...' : 'Upload'}*/}
      {/*    </button>*/}

      {/*    {uploadedImagePath && (*/}
      {/*      <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-md">*/}
      {/*        <h3 className="text-lg font-medium text-gray-700 mb-2">Ảnh đã upload:</h3>*/}
      {/*        <img*/}
      {/*          src={`http://localhost:3030${uploadedImagePath}`}*/}
      {/*          alt="Uploaded"*/}
      {/*          className="max-h-64 mx-auto rounded-md mb-3"*/}
      {/*        />*/}
      {/*        <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">*/}
      {/*          <span className="font-medium">Đường dẫn:</span> {uploadedImagePath}*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

export default CreatePost;

