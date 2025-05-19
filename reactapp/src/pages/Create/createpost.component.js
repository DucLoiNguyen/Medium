import { CKEditor } from '@ckeditor/ckeditor5-react';
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
    Title,
    CodeBlock
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TopicApi from '~/api/TopicApi';
import { useAuth } from '../Authen/authcontext';
import Pricing from '~/pages/Pricing/pricing.component';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import Loading_spinner from '~/components/partial/Loading_spinner/loading_spinner.component';

function CreatePost() {
    const [ckContent, setCKContent] = useState('');
    const [formData, setFormData] = useState({
        tittle: '',
        subtittle: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState({
        title: '',
        content: '',
        thumbnail: '',
        topic: ''
    });
    const [isloading, setIsloading] = useState(true);
    const [dataTopic, setDataTopic] = useState(null);
    const [topic, setTopic] = useState(null);
    const [dataTag, setDataTag] = useState(null);
    const [tags, setTags] = useState([]);
    const [post, setPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [memberOnly, setMemberOnly] = useState(false);
    const { user, isMember } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear validation errors when user types
        if ( name === 'tittle' ) {
            setError(prev => ({ ...prev, title: '' }));
        }
    };

    const handleChangeTopic = async (e) => {
        const selectedTopic = e.target.value ? JSON.parse(e.target.value) : null;
        setTopic(selectedTopic);

        // Clear topic error when user selects a topic
        if ( selectedTopic ) {
            setError(prev => ({ ...prev, topic: '' }));
        }
    };

    const handleTagChange = (tag) => {
        setTags(prev => {
            if ( prev.some((t) => t.tagId === tag._id) ) {
                return prev.filter((t) => t.tagId !== tag._id);
            } else {
                return [...prev, { tagId: tag._id, tagName: tag.tag }];
            }
        });
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError(prev => ({ ...prev, thumbnail: '' }));

        if ( !file ) return;

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if ( !allowedTypes.includes(file.type) ) {
            setError(prev => ({ ...prev, thumbnail: 'Only image files are accepted (JPEG, JPG, PNG, GIF)' }));
            return;
        }

        // Check file size (max: 50MB)
        if ( file.size > 50 * 1024 * 1024 ) {
            setError(prev => ({ ...prev, thumbnail: 'File size must not exceed 50MB' }));
            return;
        }

        setSelectedFile(file);

        // Create preview for the image
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            title: '',
            content: '',
            thumbnail: '',
            topic: ''
        };

        // Validate title
        if ( !formData.tittle.trim() ) {
            newErrors.title = 'Title is required';
            isValid = false;
        } else if ( formData.tittle.length > 100 ) {
            newErrors.title = 'Title must be less than 100 characters';
            isValid = false;
        }

        // Validate content
        if ( !ckContent.trim() ) {
            newErrors.content = 'Content is required';
            isValid = false;
        }

        // Validate topic selection
        if ( !topic ) {
            newErrors.topic = 'Please select a topic';
            isValid = false;
        }

        // Only validate thumbnail for new posts
        if ( !isEditing && !selectedFile && !post?.thumbnail ) {
            newErrors.thumbnail = 'Please upload a thumbnail image';
            isValid = false;
        }

        setError(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if ( !validateForm() ) {
            toast.error('Hang on! A few things still need your attention before you can submit.');
            return;
        }

        try {
            setIsloading(true);
            let imagePath = post?.thumbnail || '';

            // Upload image if a new file is selected
            if ( selectedFile ) {
                const fileImage = new FormData();
                fileImage.append('image', selectedFile);
                const response = await axios.post('http://localhost:3030/api/upload', fileImage, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                imagePath = response.data.filePath;
            }

            const status = e.nativeEvent.submitter.value;
            const postData = {
                ...formData,
                thumbnail: imagePath,
                content: ckContent,
                topic: topic,
                status: status,
                memberonly: memberOnly,
                author: {
                    authorId: user._id,
                    authorName: user.username
                },
                tags: tags
            };

            // Update or create based on whether we're editing
            if ( isEditing ) {
                await axios.put(`http://localhost:3030/api/post/updatepost/${ params.id }`, postData);
                toast.success('Post updated successfully!');
            } else {
                await axios.post('http://localhost:3030/api/post/createpost', postData);
                toast.success('Post created successfully!');
            }

            // Redirect to post list or view
            navigate('/home/story');
        } catch ( error ) {
            console.error('Error saving post:', error);
            toast.error('Failed to save post. Please try again.');
        } finally {
            setIsloading(false);
        }
    };

    // Remove selected image
    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setError(prev => ({ ...prev, thumbnail: '' }));
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsloading(true);
            try {
                const responseData = await TopicApi.getAllTopics();
                setDataTopic(responseData);

                if ( params.id ) {
                    setIsEditing(true);
                    const responsePost = await axios.get(`http://localhost:3030/api/post/getpostbyid/${ params.id }`);
                    const postData = responsePost.data;
                    setPost(postData);
                    setCKContent(postData.content || '');
                    setFormData({
                        tittle: postData.tittle || '',
                        subtittle: postData.subtittle || ''
                    });
                    setMemberOnly(postData.memberonly || false);

                    // Set topic from existing post
                    if ( postData.topic ) {
                        setTopic({
                            topicId: postData.topic.topicId,
                            topicName: postData.topic.topicName
                        });

                        // Fetch tags for this topic immediately
                        try {
                            const response = await axios.get(`http://localhost:3030/api/tag/getbyid/`, {
                                params: { id: postData.topic.topicId },
                                withCredentials: true
                            });
                            setDataTag(response.data);
                        } catch ( error ) {
                            console.error('Error fetching tags for topic:', error);
                        }
                    }

                    // Set tags from existing post
                    if ( postData.tags && postData.tags.length > 0 ) {
                        setTags(postData.tags);
                    }

                }

                setIsloading(false);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
                setDataTopic(null);
                setPost(null);
                setIsloading(false);
                toast.error('Failed to load data. Please refresh and try again.');
            }
        };

        fetchInitialData();
    }, [params.id]);

    // Fetch tags when topic changes
    useEffect(() => {
        const fetchTags = async () => {
            if ( !topic ) {
                setDataTag([]);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3030/api/tag/getbyid/`, {
                    params: { id: topic.topicId },
                    withCredentials: true
                });
                setDataTag(response.data);

                if ( isEditing ) {
                    const newTagIds = response.data.map(tag => tag._id);
                    setTags(prev => prev.filter(tag => newTagIds.includes(tag.tagId)));
                } else {
                    // Only reset tags when creating a new post and changing topics
                    setTags([]);
                }
            } catch ( error ) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, [topic, isEditing]);

    if ( !isMember ) {
        return <Pricing />;
    }

    if ( isloading ) {
        return <Loading_spinner />;
    }

    return (
        <div className="space-y-12">
            <div className="flex justify-center">
                <form onSubmit={ handleSubmit } className="w-full max-w-4xl">
                    <h1 className="text-3xl mb-8 text-center font-customs2">{ isEditing ? 'Edit Post' : 'Create New Post' }</h1>

                    <div className="mb-8">
                        <CKEditor
                            data={ ckContent }
                            onChange={ (event, editor) => {
                                const data = editor.getData();
                                setCKContent(data);
                                // Clear content error when user types
                                if ( data.trim() ) {
                                    setError(prev => ({ ...prev, content: '' }));
                                }
                            } }
                            editor={ ClassicEditor }
                            config={ {
                                toolbar: {
                                    items: ['undo',
                                        'redo',
                                        '|',
                                        'heading',
                                        '|',
                                        'bold',
                                        'italic',
                                        'underline',
                                        '|',
                                        'link',
                                        'insertImage',
                                        'mediaEmbed',
                                        'insertTable',
                                        'blockQuote',
                                        'codeBlock',
                                        '|',
                                        'bulletedList',
                                        'numberedList',
                                        'todoList',
                                        'outdent',
                                        'indent'],
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
                                    Underline,
                                    Undo,
                                    Base64UploadAdapter,
                                    CodeBlock
                                ],
                                balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
                                blockToolbar: ['bold', 'italic', '|', 'link', 'insertImage', 'insertTable', '|', 'bulletedList', 'numberedList', 'outdent', 'indent'],
                                image: {
                                    toolbar: ['toggleImageCaption', 'imageTextAlternative', 'ckboxImageEdit']
                                },
                                list: {
                                    properties: {
                                        styles: true,
                                        startIndex: true,
                                        reversed: true
                                    }
                                },
                                placeholder: 'Start writing your post content here...',
                                licenseKey: 'T3NUY0pxam5hL01xRVpXNVFZT1A2T2RDT2JnMnFsR1RxKy93cXNZNU9nOHVnakNaUkZtdHp1ck9IS0dPY1E9PS1NakF5TkRFeE1UUT0='
                            } }
                        />
                        { error.content && (
                            <p className="mt-1 text-sm/6 text-red-600">{ error.content }</p>
                        ) }
                    </div>

                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="col-span-full">
                                    <label htmlFor="thumbnail" className="block text-sm/6 font-medium text-gray-900">
                                        Story thumbnail
                                    </label>
                                    <div
                                        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <div className="text-center">
                                                { preview ? (
                                                    <div className="mt-4">
                                                        <div
                                                            className="border border-gray-200 rounded-md p-2 bg-gray-50">
                                                            <img
                                                                src={ preview }
                                                                alt="Preview"
                                                                className="max-h-64 mx-auto rounded-md"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : post?.thumbnail ? (
                                                    <div className="mt-4">
                                                        <div
                                                            className="border border-gray-200 rounded-md p-2 bg-gray-50">
                                                            <img
                                                                src={ `http://localhost:3030${ post?.thumbnail }` }
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
                                                ) }
                                                <div className="mt-4 flex text-sm/6 text-gray-600 justify-center">
                                                    <label
                                                        htmlFor="thumbnail"
                                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-gray-600 hover:text-gray-400"
                                                    >
                                                        <span>{ isEditing ? 'Change image' : 'Upload a file' }</span>
                                                        <input
                                                            id="thumbnail"
                                                            name="thumbnail"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={ handleFileChange }
                                                        />
                                                    </label>
                                                </div>

                                                { (selectedFile) && (
                                                    <button
                                                        type="button"
                                                        onClick={ handleClear }
                                                        className="px-4 my-4 rounded-full transition duration-300 hover:ring-2 hover:text-red-700 hover:ring-offset-2 hover:ring-red-700 font-semibold text-gray-600 text-sm/6"
                                                    >
                                                        Remove
                                                    </button>
                                                ) }
                                            </div>
                                        </div>
                                    </div>
                                    { error.thumbnail && (
                                        <p className="mt-1 text-sm/6 text-red-600">{ error.thumbnail }</p>
                                    ) }
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="tittle" className="block text-sm/6 font-medium text-gray-900">
                                        Title
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="tittle"
                                            id="tittle"
                                            placeholder="Write a descriptive title"
                                            value={ formData.tittle }
                                            className="uppercase block w-full bg-white px-3 py-1.5 text-base text-gray-900 border-0 border-b-2 border-gray-300 sm:text-sm/6 focus:outline-none focus:ring-0 focus:border-none"
                                            onChange={ handleChange }
                                        />
                                    </div>
                                    { error.title && (
                                        <p className="mt-1 text-sm/6 text-red-600">{ error.title }</p>
                                    ) }
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="subtittle" className="block text-sm/6 font-medium text-gray-900">
                                        Subtitle
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="subtittle"
                                            id="subtittle"
                                            placeholder="Write a brief subtitle..."
                                            value={ formData.subtittle }
                                            className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 border-0 border-b-2 border-gray-300 sm:text-sm/6 focus:outline-none focus:ring-0 focus:border-none"
                                            onChange={ handleChange }
                                        />
                                    </div>
                                    <p className="mt-1 text-sm/6 text-gray-600">
                                        Note: Changes here will affect how your story appears in
                                        public places like the homepage and in subscribers' feeds — not the
                                        content of the story itself.
                                    </p>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="topic" className="block text-sm/6 font-medium text-gray-900">
                                        Topic
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="topic"
                                            name="topic"
                                            onChange={ handleChangeTopic }
                                            defaultValue={ post?.topic ? JSON.stringify({
                                                topicId: post?.topic.topicId,
                                                topicName: post?.topic.topicName
                                            }) : '' }
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base outline-none focus:outline-none ring-0 focus:ring-0 text-gray-900 sm:text-sm/6"
                                        >
                                            <option value="" disabled>Select a topic</option>
                                            { dataTopic && dataTopic.map((item) => (
                                                <option
                                                    key={ item._id }
                                                    value={ JSON.stringify({
                                                        topicId: item._id,
                                                        topicName: item.topicname
                                                    }) }
                                                >
                                                    { item.topicname }
                                                </option>
                                            )) }
                                        </select>
                                        <svg
                                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    { error.topic && (
                                        <p className="mt-1 text-sm/6 text-red-600">{ error.topic }</p>
                                    ) }
                                </div>

                                <div className="col-span-3">
                                    { dataTag && dataTag.length > 0 ? (
                                        <div>
                                            <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                                                Tags
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                { dataTag.map(tag => (
                                                    <div key={ tag._id } className="">
                                                        <input
                                                            type="checkbox"
                                                            id={ `tag-${ tag._id }` }
                                                            checked={ tags.some((t) => t.tagId === tag._id) }
                                                            onChange={ () => handleTagChange(tag) }
                                                            className="mr-2 w-4 h-4 text-[#6b6b6b] bg-gray-100 border-gray-300 rounded-sm ring-0"
                                                        />
                                                        <label htmlFor={ `tag-${ tag._id }` }
                                                               className="font-customs text-[#6b6b6b] text-sm">
                                                            { tag.tag }
                                                        </label>
                                                    </div>
                                                )) }
                                            </div>
                                        </div>
                                    ) : topic ? (
                                        <div className="flex items-center h-full">
                                            <p className="text-sm text-gray-500">No tags available for this topic</p>
                                        </div>
                                    ) : null }
                                </div>

                                <div className="col-span-full">
                                    <div className="flex">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="member-only"
                                                name="memberOnly"
                                                type="checkbox"
                                                checked={ memberOnly }
                                                onChange={ () => setMemberOnly(!memberOnly) }
                                                className="w-4 h-4 text-[#6b6b6b] bg-gray-100 border-gray-300 rounded-sm ring-0"
                                            />
                                        </div>
                                        <div className="ms-2 text-sm">
                                            <label
                                                htmlFor="member-only"
                                                className="font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Members only
                                            </label>
                                            <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
                                                Restrict access to members only
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="button"
                            onClick={ () => navigate('/home/story') }
                            className="text-sm text-gray-900 px-4 py-1 ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            value="false"
                            className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out"
                        >
                            { isEditing ? 'Update as draft' : 'Save as draft' }
                        </button>
                        <button
                            type="submit"
                            value="true"
                            className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out"
                        >
                            Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;