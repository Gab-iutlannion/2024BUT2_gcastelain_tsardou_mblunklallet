
const emblaNode = document.querySelector('.embla')
const options = { loop: true }


const emblaApi = emblaNode ? EmblaCarousel(emblaNode, options, plugins) : null;

function scrollNext() {
    emblaApi?.scrollNext();
}

function scrollPrev() {
    emblaApi?.scrollPrev();
}

