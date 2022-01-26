<?php

namespace App\Controller;

use App\Entity\Abonnement;
use App\Entity\Article;
use App\Entity\Category;
use App\Entity\User;
use App\Entity\Comment;
use App\Entity\MysteryBox;
use App\Entity\Photo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/article")
 */
class ArticleController extends AbstractController
{

    /**
     * @Route("/all", name="article_all", methods={"GET"})
     */
    public function readAll(): Response
    {
        $articles =  $this->getDoctrine()->getRepository(Article::class)->findAll();
        $data = [];
        foreach ($articles as $article) {
            array_push($data, $this->getArticleData($article));
        }
        return $this->json($data);
    }

    /**
     * @Route("/new", name="article_new", methods={"POST"})
     */
    public function addArticle(Request $request, EntityManagerInterface $entityManager): Response
    {
        $article = new Article();
        $article->setName($request->request->get("name"));
        $article->setDescription($request->request->get("description"));
        $article->setWeight($request->request->get("weight"));
        $article->setColor($request->request->get("color"));
        $article->setQuantity($request->request->get("quantity"));
        $article->setPrice($request->request->get("price"));
        $article->setPromo($request->request->get("promo"));
        if ($request->request->get("photo") !== "") {
            $photo = new Photo();
            $photo->setImgLink($request->request->get("photo"));
            $entityManager->persist($photo);
            $article->addPhoto($photo);
        }
        $article->setCreationDate(new \Datetime());
        $article->setUpdatedDate(new \Datetime());
        $article->setNew(true);
        $cat_arr = explode(",", $request->request->get("categories"));

        foreach ($cat_arr as $value) {
            $value = trim(strtolower($value));
            if ($value !== "") {
                $existing_cat = $this->getDoctrine()->getRepository(Category::class)->findBy([
                    "name" => $value
                ]);
                if ($existing_cat) {
                    $article->addCategory($existing_cat[0]);
                } else {
                    $category = new Category();
                    $category->setName($value);
                    $entityManager->persist($category);
                    $article->addCategory($category);
                }
            }
        }


        $entityManager->persist($article);
        $entityManager->flush();
        $articles =  $this->getDoctrine()->getRepository(Article::class)->findAll();
        $data = [];
        foreach ($articles as $article) {
            array_push($data, $this->getArticleData($article));
        }

        return $this->json($data);
    }

    /**
     * @Route("/{id}", name="article", methods={"GET"})
     */
    public function show(Article $article): Response
    {
        $comment = [];
        foreach ($article->getComments() as $value) {
            $name_user = $this->getDoctrine()->getRepository(User::class)->find($value->getUser()->getId());
            $firstname = $name_user->getFirstName();
            $lastname =  $name_user->getLastName();
            array_push($comment, [
                'id' => $value->getId(),
                'content' => $value->getContent(),
                'user_id' => $value->getUser()->getId(),
                'CreationDate' => $value->getCreationDate(),
                'firstname' => $firstname,
                'lastname' => $lastname,
            ]);
        }

        $data =  $this->getArticleData($article);
        $data["data"]["comments"] = $comment;
        return $this->json($data);
    }


    /**
     * @Route("/{id}/edit", name="article_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Article $article, EntityManagerInterface $entityManager): Response
    {

        $name = $request->request->get("name");
        $description = $request->request->get("description");
        $weight = $request->request->get("weight");
        $color = $request->request->get("color");
        $quantity = $request->request->get("quantity");
        $price = $request->request->get("price");
        $promo = $request->request->get("promo");
        $cat = $request->request->get("categories");
        $article->setUpdatedDate(new \Datetime());
        $article->setNew(true);
        if ($name !== "")
            $article->setName($name);
        if ($description !== "")
            $article->setDescription($description);
        if ($weight !== "")
            $article->setWeight($weight);
        if ($color !== "")
            $article->setColor($color);
        if ($quantity !== "")
            $article->setQuantity($quantity);
        if ($price !== "")
            $article->setPrice($price);
        if ($promo !== "")
            $article->setPromo($promo);
        if ($cat !== "") {
            $cat_arr = explode(",", $cat);
            foreach ($article->getCategories() as $existing_cat) {
                $article->removeCategory($existing_cat);
                // $entityManager->remove($existing_cat); 
            }
            foreach ($cat_arr as $value) {
                $value = trim(strtolower($value));
                $category = $this->getDoctrine()->getRepository(Category::class)->findBy(["name" => $value]);
                if (count($category) < 1) {
                    $category = new Category();
                    $entityManager->persist($category);
                } else {
                    $category = $category[0];
                }
                $category->setName($value);
                $article->addCategory($category);
            }
        }
        $entityManager->persist($article);
        $entityManager->flush();
        $data = $this->getArticleData($article);
        $data["status"] = "ok";
        return $this->json($data);
    }

    /**
     * @Route("/add-photos/{id}", name="add_photos", methods={"POST"})
     */
    public function addPhoto(Request $request, Article $article, EntityManagerInterface $entityManager): Response
    {
        $array = json_decode($request->getContent());
        foreach ($array as $photo) {
            $p = new Photo();
            $p->setImgLink($photo);
            $article->addPhoto($p);
            $entityManager->persist($p);
        }
        $entityManager->flush();
        $data = $this->getArticleData($article);
        $data["status"] = "ok";
        return $this->json($data);
    }
    /**
     * @Route("/remove-photo/{id}/{photo}", name="remove_photos", methods={"GET"})
     */
    public function deletePhoto(Article $article, EntityManagerInterface $entityManager, $photo): Response
    {
        $p = $this->getDoctrine()->getRepository(Photo::class)->find($photo);
        $article->removePhoto($p);
        $entityManager->remove($p);
        $entityManager->flush();
        $data = $this->getArticleData($article);
        return $this->json($data);
    }

    /**
     * @Route("/delete/{id}", name="delete", methods={"GET"})
     */
    public function deleteArticle(Article $article,  EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($article);
        $entityManager->flush();
        return $this->json(["status" => "ok"]);
    }



    public function getArticleData(Article $article)
    {
        $categories = [];
        $photos = [];

        foreach ($article->getPhotos() as $photo) {
            array_push(
                $photos,
                [
                    "imgLink" => $photo->getImgLink(),
                    "id" => $photo->getId(),
                ]
            );
        }
        foreach ($article->getCategories() as $cat) {
            // dump($cat);
            array_push($categories, [
                "name" => $cat->getName(),
                "id" => $cat->getId(),
            ]);
        }

        return [
            "data" => [
                "categories" => $categories,
                "photos" => $photos,
                "id" => $article->getId(),
                "name" => $article->getName(),
                "description" => $article->getDescription(),
                "quantity" => $article->getQuantity(),
                "price" => $article->getPrice(),
                "new" => $article->getNew(),
                "promo" => $article->getPromo(),
                "weight" => $article->getWeight(),
                "color" => $article->getColor(),
                "creation_date" => $article->getCreationDate(),
                "updated_date" => $article->getUpdatedDate(),
            ]
        ];
    }
    /**
     * @Route("/avis/add/{id}", name="add_avis", methods={"POST"})
     */
    public function avis_add(Article $article, Request $request, EntityManagerInterface $entityManager): Response
    {
        $avis = new comment;
        $avis->setCreationDate(new \DateTime());
        $avis->setContent($request->request->get("content"));
        $user = $this->getDoctrine()->getRepository(User::class)->find($request->request->get("user_id"));
        $avis->setUser($user);
        $avis->setArticle($article);

        $entityManager->persist($avis);
        $entityManager->flush();

        return $this->json([
            "status" => "ok",
        ]);
    }

    /**
     * @Route("/avis/remove/{id}", name="remove_avis", methods={"GET"})
     */
    public function remove_comment(Comment $comment, Request $request, EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($comment);
        $entityManager->flush();

        return $this->json([
            "status" => "ok",
        ]);
    }
    /**
     * @Route("/mystery_new", name="mystery_new", methods={"POST"})
     */
    public function mystery_new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $article = new Article();
        $article->setName($request->request->get("name"));
        $article->setDescription($request->request->get("description"));
        $article->setWeight($request->request->get("weight"));
        $article->setColor($request->request->get("color"));
        $article->setQuantity($request->request->get("quantity"));
        $article->setPrice($request->request->get("price"));
        $article->setPromo($request->request->get("promo"));
        if ($request->request->get("photo") !== "") {
            $photo = new Photo();
            $photo->setImgLink($request->request->get("photo"));
            $entityManager->persist($photo);
            $article->addPhoto($photo);
        }
        $article->setCreationDate(new \Datetime());
        $article->setUpdatedDate(new \Datetime());
        $article->setNew(true);
        $cat_arr = explode(",", $request->request->get("categories"));

        foreach ($cat_arr as $value) {
            $value = trim(strtolower($value));
            if ($value !== "") {
                $existing_cat = $this->getDoctrine()->getRepository(Category::class)->findBy([
                    "name" => $value
                ]);
                if ($existing_cat) {
                    $article->addCategory($existing_cat[0]);
                } else {
                    $category = new Category();
                    $category->setName($value);
                    $entityManager->persist($category);
                    $article->addCategory($category);
                }
            }
        }
        $article->setMysteryBox(true);
        $article->setSubscriptionPrice($request->request->get("subscriptionprice"));


        $entityManager->persist($article);
        $entityManager->flush();
        $articles =  $this->getDoctrine()->getRepository(Article::class)->findAll();
        $data = [];
        foreach ($articles as $article) {
            array_push($data, $this->getArticleData($article));
        }

        return $this->json($data);
    }

    /**
     * @Route("/mystery_abonnement", name="mystery_abonnement", methods={"POST"})
     */
    public function mystery_abonnement(Request $request, EntityManagerInterface $entityManager): Response
    {
        $User = $this->getDoctrine()->getRepository(User::class)->find($request->request->get("user"));
        $MysteryBox = $this->getDoctrine()->getRepository(Article::class)->find($request->request->get("MysteryBox"));
        $Mystery = new Abonnement;
        $date = new \Datetime();
        $Mystery->setDebutAbonnement($date);
        $Mystery->setUser($User);
        $Mystery->setMysterybox($MysteryBox);
        $Mystery->setFinAbonnement($date);
        $entityManager->persist($Mystery);
        $entityManager->flush();
        return $this->json([
            "status" => "ok",
        ]);
    }

    /**
     * @Route("/mystery_all", name="mystery_all", methods={"POST"})
     */
    public function mystery_all(EntityManagerInterface $entityManager): Response
    {

        $Mysterys =  $this->getDoctrine()->getRepository(Article::class)->findBy(['mysteryBox' => true]);
        // dd($Mysterys);
        $data = [];
        foreach ($Mysterys as $Mystery) {
            // $UserMystery = [];
            $PhotoMystery = [];
            // foreach ($Mystery->getUsers() as $value) {

            //     array_push($UserMystery, [
            //         'id' => $value->getId(),
            //         'firstname' => $value->getFirstName(),
            //         'lastname' => $value->getLastName(),
            //     ]);
            // }
            foreach ($Mystery->getPhotos() as $key => $value) {
                array_push($PhotoMystery, [
                    'image_link' =>  $Mystery->getImgLink(),
                ]);
            }
            array_push($data, [
                "id" => $Mystery->getId(),
                "firstname" => $Mystery->getName(),
                // "user" => $UserMystery,
                'photo' => $PhotoMystery,
            ]);
        }
        return $this->json(['result' => $data]);
    }


    /**
     * @Route("/mystery_show/{id}", name="mystery_show", methods={"GET"})
     */
    public function mystery_Show(Article $Mystery, EntityManagerInterface $entityManager): Response
    {
        $userinfo = [];
        $photo = [];
        // dd($Mystery);
        // foreach ($Mystery->getAbonnement() as $key => $value) {
        //     array_push($userinfo, [
        //         'id' => $value->getId(),
        //         'firstname' => $value->getFirstname(),
        //         'lastname' => $value->getLastname(),
        //     ]);
        // };
        $name = $Mystery->getName();
        $description = $Mystery->getDescription();
        $Mystery_price_subscrition = $Mystery->getSubscriptionPrice();
        foreach ($Mystery->getPhotos() as $key => $value) {
            array_push($photo, [
                'id' => $value->getId(),
                'link' => $value->getImgLink(),
            ]);
        };


        return $this->json([
            "result" => ['user_info' => $userinfo, 'subscrition_price' => $Mystery_price_subscrition, 'name' => $name, 'description' => $description, 'photo' => $photo],

        ]);
    }



    /**
     * @Route("/mystery_edit/{id}", name="mystery_edit", methods={"POST"})
     */
    public function mystery_edit(Request $request, Article $article, EntityManagerInterface $entityManager): Response
    {
        $name = $request->request->get("name");
        $description = $request->request->get("description");
        $weight = $request->request->get("weight");
        $color = $request->request->get("color");
        $quantity = $request->request->get("quantity");
        $price = $request->request->get("price");
        $promo = $request->request->get("promo");
        $cat = $request->request->get("categories");
        $sub = $request->request->get("subscriptionprice");
        $article->setUpdatedDate(new \Datetime());
        $article->setNew(true);
        if ($name !== "")
            $article->setName($name);
        if ($description !== "")
            $article->setDescription($description);
        if ($weight !== "")
            $article->setWeight($weight);
        if ($color !== "")
            $article->setColor($color);
        if ($quantity !== "")
            $article->setQuantity($quantity);
        if ($price !== "")
            $article->setPrice($price);
        if ($promo !== "")
            $article->setPromo($promo);
        if ($sub !== "")
            $article->setSubscriptionPrice($sub);
        if ($cat !== "") {
            $cat_arr = explode(",", $cat);
            foreach ($article->getCategories() as $existing_cat) {
                $article->removeCategory($existing_cat);
                // $entityManager->remove($existing_cat); 
            }
            foreach ($cat_arr as $value) {
                $value = trim(strtolower($value));
                $category = $this->getDoctrine()->getRepository(Category::class)->findBy(["name" => $value]);
                if (count($category) < 1) {
                    $category = new Category();
                    $entityManager->persist($category);
                } else {
                    $category = $category[0];
                }
                $category->setName($value);
                $article->addCategory($category);
            }
        }
        $entityManager->persist($article);
        $entityManager->flush();
        $data = $this->getArticleData($article);
        $data["status"] = "ok";
        return $this->json($data);
    }
}
