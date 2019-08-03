const BASE_URL = "https://api.unsplash.com/photos/";
const CLIENT_ID = "ca5a2a324ba06f2cf8bede88a989bb6c2f5f87730032b3c6256b72888f2cc94c";

const PER_PAGE = 20;

const Request = {
    baseUrl: `${BASE_URL}?client_id=${CLIENT_ID}`,

    listPhotos: function (limit, page) {        
        const url = `${this.baseUrl}&per_page=${limit}&page=${page}`;

        return fetch(url).then(response => {
            return response.json();
        });
    }
}

function Img (photo) {
    const {likes, update_at, urls: {thumb}} = photo;

    const wrap = document.createElement('div');
    wrap.classname = 'photo';

    const img = document.createElement('img');
    img.src = thumb;

    const like =  document.createElement('span');
    like.innerHTML = likes;
    
    const date_at =  document.createElement('i');
    date_at.innerHTML = update_at;

    wrap.append(like);
    wrap.append(date_at);
    wrap.append(img);

    return wrap;

} // этот обработчик отвечает только за создание картинки

function Gallery(params) {

    const {
        limit, 
        page,
        gallery_id,
        nav_id
    } = params;

    this.photos = [];
    this.page = page;
    this.limit = limit;

    this.container = document.querySelector(gallery_id);

    this.btnLeft = document.querySelector(`${nav_id} #prev`);
    this.btnRight = document.querySelector(`${nav_id} #next`);
    this.input = document.querySelector(`${nav_id} input`);
    this.select = document.querySelector(`${nav_id} select`);

    this.input.value = this.page;
    this.select.value = this.limit;

    this.changePage = (e) => {
        const IS_LEFT = e.target === this.btnLeft;
        const IS_RIGHT = e.target === this.btnRight;
        const IS_SELECT = e.target === this.select;
        const IS_INPUT = e.target === this.input;

        if (IS_LEFT && this.page > 1) {
            this.page --;
        }
        if (IS_RIGHT) {
            this.page ++;
        }
        if (IS_SELECT) {
            this.limit = this.select.value;
        }
        if (IS_INPUT) {
            this.page = this.input.value;
        }

        !IS_INPUT && (this.input.value = this.page);

        this.fetchPhotos ();
    }

    this.btnLeft.onclick = this.changePage;
    this.btnRight.onclick = this.changePage;
    this.input.oninput = this.changePage;
    this.select.onchange = this.changePage;

    this.renderList = () => {    

        Request.listPhotos (this.limit, this.page)
            .then (data => {
                const photos = data.map (photo=> {
                    //console.log (photo);
                    return new Img (photo);
                });
                this.container.append(...photos);
                console.log (photos);
            })
        
        //this.container.innerHTML = '';

        //for (photo of this.photos) {
           
        //    const img = new Img(photo);
    
        //    this.container.append(img);
        //}
    }
}

const gallery = new Gallery ({
    limit: 10, 
    page: 1,
    gallery_id: '#gallery',
    nav_id: '#navigation'
});

gallery.renderList ();
