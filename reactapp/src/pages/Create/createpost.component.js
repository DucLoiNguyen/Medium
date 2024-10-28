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

function CreatePost() {
  return (
    <CKEditor
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
              "ckbox",
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
          image:{
            toolbar: [ 'toggleImageCaption', 'imageTextAlternative', 'ckboxImageEdit' ]
          },
          list:{
            properties: {
              styles: true,
              startIndex: true,
              reversed: true
            }
          },
          title: {
            placeholder: "type the title",
          },
          placeholder: 'My custom placeholder for the body',
          initialData: "",
          licenseKey: "T3NUY0pxam5hL01xRVpXNVFZT1A2T2RDT2JnMnFsR1RxKy93cXNZNU9nOHVnakNaUkZtdHp1ck9IS0dPY1E9PS1NakF5TkRFeE1UUT0="
        }
      }
    />
  );
}

export default CreatePost;

