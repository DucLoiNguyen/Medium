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

function Account() {
    const [ckContent, setCKContent] = useState('');
    const [formData, setFormData] = useState({
        tittle: '',
        subtittle: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [isloading, setIsloading] = useState(true);
    const [dataTopic, setDataTopic] = useState(null);
    const [topic, setTopic] = useState(null);
    const [dataTag, setDataTag] = useState(null);
    const [tags, setTags] = useState([]);
    const [post, setPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [memberOnly, setMemberOnly] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { user, isMember } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangeTopic = async (e) => {
        setTopic(JSON.parse(e.target.value));
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
        setError('');

        if ( !file ) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if ( !allowedTypes.includes(file.type) ) {
            setError('Only image files are accepted (JPEG, JPG, PNG, GIF)');
            return;
        }

        if ( file.size > 50 * 1024 * 1024 ) {
            setError('File size cannot exceed 50MB');
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        setError('');
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

    // Fetch tags when topic is selected
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
        <div className="max-w-5xl mx-auto font-sans">
            {/* Top Navigation Bar */ }
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="flex justify-between items-center py-2 px-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={ () => navigate('/home/story') }
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 }
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <span className="text-sm font-medium">
                            { isEditing ? 'Edit story' : 'Draft' }
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={ () => setShowSettings(!showSettings) }
                            className="text-sm px-3 py-1.5 rounded-full hover:bg-gray-100 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 }
                                 stroke="currentColor" className="w-4 h-4 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </button>

                        <button
                            type="button"
                            onClick={ () => document.getElementById('post-form').requestSubmit(document.getElementById('save-draft')) }
                            className="text-sm border border-gray-300 px-3 py-1.5 rounded-full hover:border-gray-500 transition-all"
                        >
                            Save draft
                        </button>

                        <button
                            type="button"
                            onClick={ () => document.getElementById('post-form').requestSubmit(document.getElementById('publish')) }
                            className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 transition-all"
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Panel - Slides in from right when settings button is clicked */ }
            <div
                className={ `fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${ showSettings ? 'translate-x-0' : 'translate-x-full' } overflow-y-auto` }>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Story settings</h2>
                        <button
                            onClick={ () => setShowSettings(false) }
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 }
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Title */ }
                        <div>
                            <label htmlFor="tittle" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                name="tittle"
                                id="tittle"
                                placeholder="Add a title"
                                value={ formData.tittle }
                                onChange={ handleChange }
                                className="w-full p-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Subtitle */ }
                        <div>
                            <label htmlFor="subtittle" className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                name="subtittle"
                                id="subtittle"
                                placeholder="Add a subtitle"
                                value={ formData.subtittle }
                                onChange={ handleChange }
                                className="w-full p-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none"
                            />
                        </div>

                        {/* Topic Selection */ }
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                                Topic
                            </label>
                            <select
                                id="topic"
                                name="topic"
                                onChange={ handleChangeTopic }
                                defaultValue={ JSON.stringify({
                                    topicId: post?.topic?.topicId,
                                    topicName: post?.topic?.topicName
                                }) || '' }
                                className="w-full p-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none appearance-none bg-transparent"
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
                        </div>

                        {/* Tags */ }
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            { dataTag && dataTag.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    { dataTag.map(tag => (
                                        <div
                                            key={ tag._id }
                                            onClick={ () => handleTagChange(tag) }
                                            className={ `px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                                                tags.some((t) => t.tagId === tag._id)
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }` }
                                        >
                                            { tag.tag }
                                        </div>
                                    )) }
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Select a topic to see available tags</p>
                            ) }
                        </div>

                        {/* Feature Image */ }
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Feature image
                            </label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                { preview ? (
                                    <div className="relative">
                                        <img
                                            src={ preview }
                                            alt="Preview"
                                            className="max-h-48 mx-auto rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={ handleClear }
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={ 1.5 } stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : post?.thumbnail ? (
                                    <div className="relative">
                                        <img
                                            src={ `http://localhost:3030${ post?.thumbnail }` }
                                            alt="Preview"
                                            className="max-h-48 mx-auto rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={ handleClear }
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={ 1.5 } stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <svg
                                            className="mx-auto size-12 text-gray-300"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">Add a high-quality image to your story
                                            to capture people's interest</p>
                                    </div>
                                ) }

                                <input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    className="hidden"
                                    onChange={ handleFileChange }
                                />

                                <button
                                    type="button"
                                    onClick={ () => document.getElementById('thumbnail').click() }
                                    className="mt-3 text-sm text-gray-700 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-50"
                                >
                                    { (preview || post?.thumbnail) ? 'Change' : 'Add an image' }
                                </button>

                                { error && (
                                    <p className="mt-1 text-sm text-red-600">{ error }</p>
                                ) }
                            </div>
                        </div>

                        {/* Member only toggle */ }
                        <div className="flex items-center py-2">
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-gray-700">Member-only story</p>
                                <p className="text-xs text-gray-500">Only members can view this content</p>
                            </div>
                            <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={ memberOnly }
                                        onChange={ () => setMemberOnly(!memberOnly) }
                                        className="sr-only peer"
                                    />
                                    <div
                                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Editor */ }
            <form id="post-form" onSubmit={ handleSubmit } className="px-4 py-6 max-w-3xl mx-auto">
                {/* Hidden submit buttons for the form */ }
                <button id="save-draft" type="submit" value="false" className="hidden"></button>
                <button id="publish" type="submit" value="true" className="hidden"></button>

                {/* Title Input (visible in the main area) */ }
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={ formData.tittle }
                        onChange={ (e) => setFormData({ ...formData, tittle: e.target.value }) }
                        className="w-full text-4xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-300"
                    />
                </div>

                {/* Subtitle Input (visible in the main area) */ }
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Subtitle"
                        value={ formData.subtittle }
                        onChange={ (e) => setFormData({ ...formData, subtittle: e.target.value }) }
                        className="w-full text-xl text-gray-500 border-none focus:outline-none focus:ring-0 placeholder-gray-300"
                    />
                </div>

                {/* CKEditor with minimal styling */ }
                <div className="prose prose-lg max-w-none">
                    <CKEditor
                        data={ ckContent }
                        onChange={ (event, editor) => {
                            const data = editor.getData();
                            setCKContent(data);
                        } }
                        editor={ ClassicEditor }
                        config={ {
                            toolbar: {
                                items: [
                                    'heading',
                                    '|',
                                    'bold',
                                    'italic',
                                    'link',
                                    '|',
                                    'bulletedList',
                                    'numberedList',
                                    '|',
                                    'blockQuote',
                                    'insertImage',
                                    'mediaEmbed',
                                    'insertTable',
                                    'codeBlock'
                                ],
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
                            balloonToolbar: ['bold', 'italic', '|', 'link'],
                            blockToolbar: ['heading', 'blockQuote', 'insertTable', 'imageUpload'],
                            image: {
                                toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side']
                            },
                            placeholder: 'Tell your story...',
                            licenseKey: 'T3NUY0pxam5hL01xRVpXNVFZT1A2T2RDT2JnMnFsR1RxKy93cXNZNU9nOHVnakNaUkZtdHp1ck9IS0dPY1E9PS1NakF5TkRFeE1UUT0='
                        } }
                    />
                </div>
            </form>
        </div>
    );
}

export default Account;